<?php
header('Content-Type: application/json');

// Never leak PHP warnings/fatals as HTML into a JSON response — that produces
// "Unexpected token '<'" on the client. Suppress HTML error output and convert
// uncaught exceptions and fatals into clean JSON.
ini_set('display_errors', '0');
error_reporting(E_ALL);

set_exception_handler(function ($e) {
    if (!headers_sent()) http_response_code(500);
    echo json_encode(['error' => 'Server error: ' . $e->getMessage()]);
    exit;
});

register_shutdown_function(function () {
    $err = error_get_last();
    if ($err && in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        if (!headers_sent()) http_response_code(500);
        echo json_encode(['error' => 'Server error: ' . $err['message']]);
    }
});

// MIME detection that does not hard-depend on any single extension being
// enabled (finfo -> mime_content_type -> getimagesize).
function detectMimeType($path) {
    if (function_exists('finfo_open')) {
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo) {
            $type = @finfo_file($finfo, $path);
            finfo_close($finfo);
            if ($type) return $type;
        }
    }
    if (function_exists('mime_content_type')) {
        $type = @mime_content_type($path);
        if ($type) return $type;
    }
    $info = @getimagesize($path);
    return $info['mime'] ?? '';
}

// ---- Authentication ----------------------------------------------------
// Credentials live in a PHP file OUTSIDE the web root (FTP home, next to www/).
const AUTH_COOKIE = 'chifaa_admin';

function getAdminConfig() {
    $path = __DIR__ . '/../../admin-config.php';
    if (!file_exists($path)) {
        http_response_code(500);
        echo json_encode(['error' => 'admin-config.php missing. Upload it to the FTP home, next to www/.']);
        exit;
    }
    return require $path;
}

// Cookie value is "expiry|hmac(expiry, secret)": stateless, no PHP sessions.
function isAuthenticated($config) {
    $cookie = $_COOKIE[AUTH_COOKIE] ?? '';
    $parts = explode('|', $cookie);
    if (count($parts) !== 2) return false;
    list($expiry, $sig) = $parts;
    return hash_equals(hash_hmac('sha256', $expiry, $config['secret']), $sig)
        && (int)$expiry > time();
}

function setAuthCookie($config, $expiry) {
    $value = $expiry > 0 ? $expiry . '|' . hash_hmac('sha256', (string)$expiry, $config['secret']) : '';
    setcookie(AUTH_COOKIE, $value, [
        'expires' => $expiry > 0 ? $expiry : time() - 3600,
        'path' => '/admin/',
        'secure' => !empty($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
}

function requireAuth() {
    if (!isAuthenticated(getAdminConfig())) {
        http_response_code(401);
        echo json_encode(['error' => 'Not authenticated']);
        exit;
    }
}

function login() {
    $config = getAdminConfig();
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    $password = (string)($input['password'] ?? '');
    if ($password === '' || !hash_equals((string)$config['password'], $password)) {
        http_response_code(401);
        echo json_encode(['error' => 'Incorrect password']);
        return;
    }
    $expiry = time() + (!empty($input['remember']) ? 30 * 86400 : 12 * 3600);
    setAuthCookie($config, $expiry);
    echo json_encode(['success' => true]);
}
// ------------------------------------------------------------------------

$dataDir = __DIR__ . '/../data/';

// Get the action
$action = $_GET['action'] ?? '';
$file = $_GET['file'] ?? '';

switch ($action) {
    case 'login':
        login();
        break;
    case 'logout':
        setAuthCookie(getAdminConfig(), 0);
        echo json_encode(['success' => true]);
        break;
    case 'check':
        echo json_encode(['authenticated' => isAuthenticated(getAdminConfig())]);
        break;
    case 'read':
        readJsonFile($file, $dataDir);
        break;
    case 'write':
        requireAuth();
        writeJsonFile($file, $dataDir);
        break;
    case 'list':
        listJsonFiles($dataDir);
        break;
    case 'upload-image':
        requireAuth();
        uploadImage();
        break;
    default:
        echo json_encode(['error' => 'Invalid action']);
        break;
}

function readJsonFile($file, $dataDir) {
    $filePath = $dataDir . basename($file) . '.json';
    
    if (!file_exists($filePath)) {
        http_response_code(404);
        echo json_encode(['error' => 'File not found']);
        return;
    }
    
    $content = file_get_contents($filePath);
    echo $content;
}

function writeJsonFile($file, $dataDir) {
    $filePath = $dataDir . basename($file) . '.json';
    
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        return;
    }
    
    // Pretty print JSON
    $jsonContent = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
    if (file_put_contents($filePath, $jsonContent) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write file']);
        return;
    }
    
    echo json_encode(['success' => true, 'message' => 'File saved successfully']);
}

function listJsonFiles($dataDir) {
    $files = glob($dataDir . '*.json');
    $fileList = array_map(function($file) {
        return basename($file, '.json');
    }, $files);
    
    echo json_encode($fileList);
}

function uploadImage() {
    // Check if file was uploaded
    if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
        http_response_code(400);
        echo json_encode(['error' => 'No file uploaded or upload error']);
        return;
    }

    $file = $_FILES['image'];
    $itemId = $_POST['itemId'] ?? 'temp';
    $section = $_POST['section'] ?? 'blog';
    
    // Determine upload directory based on section
    if ($section === 'authors') {
        $uploadDir = __DIR__ . '/../assets/images/authors/';
    } elseif ($section === 'startups') {
        $uploadDir = __DIR__ . '/../assets/images/startups/';
    } elseif ($section === 'partners') {
        $uploadDir = __DIR__ . '/../assets/images/partners/';
    } elseif ($section === 'experts') {
        $uploadDir = __DIR__ . '/../assets/images/experts/';
    } elseif ($section === 'founders' || $section === 'founder') {
        $uploadDir = __DIR__ . '/../assets/images/founders/';
    } elseif ($section === 'projects') {
        $uploadDir = __DIR__ . '/../assets/images/projects/';
    } elseif ($section === 'services') {
        $uploadDir = __DIR__ . '/../assets/images/services/';
    } elseif ($section === 'team') {
        $uploadDir = __DIR__ . '/../assets/images/team/';
    } elseif ($section === 'reviews') {
        $uploadDir = __DIR__ . '/../assets/images/reviews/';
    } elseif ($section === 'gallery') {
        $uploadDir = __DIR__ . '/../assets/images/gallery/';
    } elseif ($section === 'podcast') {
        $uploadDir = __DIR__ . '/../assets/images/podcast/';
    } else {
        // Default to articles with item-specific folders
        $uploadDir = __DIR__ . '/../assets/images/articles/' . $itemId . '/';
    }
    
    // Create directory if it doesn't exist
    if (!is_dir($uploadDir)) {
        if (!mkdir($uploadDir, 0755, true)) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create upload directory']);
            return;
        }
    }

    // Validate file type
    $allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    $fileType = detectMimeType($file['tmp_name']);

    if (!in_array($fileType, $allowedTypes)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.']);
        return;
    }

    // Validate file size (max 5MB after processing)
    if ($file['size'] > 5 * 1024 * 1024) {
        http_response_code(400);
        echo json_encode(['error' => 'File too large. Maximum size is 5MB.']);
        return;
    }

    // Generate unique filename
    $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('img_', true) . '.' . $extension;
    $targetPath = $uploadDir . $filename;

    // Move uploaded file
    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to move uploaded file']);
        return;
    }

    // Return the URL path relative to root based on section
    if ($section === 'authors') {
        $url = 'assets/images/authors/' . $filename;
    } elseif ($section === 'startups') {
        $url = 'assets/images/startups/' . $filename;
    } elseif ($section === 'partners') {
        $url = 'assets/images/partners/' . $filename;
    } elseif ($section === 'experts') {
        $url = 'assets/images/experts/' . $filename;
    } elseif ($section === 'founders' || $section === 'founder') {
        $url = 'assets/images/founders/' . $filename;
    } elseif ($section === 'projects') {
        $url = 'assets/images/projects/' . $filename;
    } elseif ($section === 'services') {
        $url = 'assets/images/services/' . $filename;
    } elseif ($section === 'team') {
        $url = 'assets/images/team/' . $filename;
    } elseif ($section === 'reviews') {
        $url = 'assets/images/reviews/' . $filename;
    } elseif ($section === 'gallery') {
        $url = 'assets/images/gallery/' . $filename;
    } elseif ($section === 'podcast') {
        $url = 'assets/images/podcast/' . $filename;
    } else {
        $url = 'assets/images/articles/' . $itemId . '/' . $filename;
    }
    echo json_encode(['success' => true, 'url' => $url]);
}
?>
