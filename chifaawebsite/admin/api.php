<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$dataDir = __DIR__ . '/../data/';

// Get the action
$action = $_GET['action'] ?? '';
$file = $_GET['file'] ?? '';

switch ($action) {
    case 'read':
        readJsonFile($file, $dataDir);
        break;
    case 'write':
        writeJsonFile($file, $dataDir);
        break;
    case 'list':
        listJsonFiles($dataDir);
        break;
    case 'upload-image':
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
    } elseif ($section === 'founders') {
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
    $fileType = mime_content_type($file['tmp_name']);
    
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
        $url = '../assets/images/authors/' . $filename;
    } elseif ($section === 'startups') {
        $url = '../assets/images/startups/' . $filename;
    } elseif ($section === 'partners') {
        $url = '../assets/images/partners/' . $filename;
    } elseif ($section === 'experts') {
        $url = '../assets/images/experts/' . $filename;
    } elseif ($section === 'founders') {
        $url = '../assets/images/founders/' . $filename;
    } elseif ($section === 'projects') {
        $url = '../assets/images/projects/' . $filename;
    } elseif ($section === 'services') {
        $url = '../assets/images/services/' . $filename;
    } elseif ($section === 'team') {
        $url = '../assets/images/team/' . $filename;
    } elseif ($section === 'reviews') {
        $url = '../assets/images/reviews/' . $filename;
    } elseif ($section === 'gallery') {
        $url = '../assets/images/gallery/' . $filename;
    } else {
        $url = '../assets/images/articles/' . $itemId . '/' . $filename;
    }
    echo json_encode(['success' => true, 'url' => $url]);
}
?>
