<?php
// share.php - Proxy for Facebook Crawler
// Serves static HTML with Open Graph tags for Facebook/social bots.

// Debug mode is now disabled by default for production
$debug = isset($_GET['debug']);
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

// 1. Sanitize slug
// We simply trim it. We will use urlencode() for the API call and htmlspecialchars() for HTML output.
$slug = trim($slug);

if (empty($slug)) {
    if ($debug) die("Error: No slug provided.");
    header("Location: /blog");
    exit;
}

$supabaseUrl = "https://inivoiunisrgdinrcquu.supabase.co";
$supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w";

// URL encode the slug to handle spaces, emojis, and special chars in the API request
// rawurlencode is safer for REST APIs (spaces become %20 instead of +)
$url = $supabaseUrl . "/rest/v1/blog_posts?slug=eq." . rawurlencode($slug) . "&select=*";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_TIMEOUT, 15);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "apikey: " . $supabaseKey,
    "Authorization: Bearer " . $supabaseKey
));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

// ... (Debug block removed for brevity, it's not in the target range really but keeping context)

// Default values
$title = "ECOVLUU Blog";
$description = "Read our latest article on ECOVLUU.";
$imageUrl = "https://www.ecovluu.com/ecovluu-logo.png";

// CRITICAL: og:url must point to THIS file (share.php) so Facebook keeps using this metadata.
// If we point it to /blog/slug, Facebook might re-crawl the React app and lose the tags.
$shareUrl = "https://www.ecovluu.com/share.php?slug=" . rawurlencode($slug);
// The "Real" URL for users is the blog
$reactUrl = "https://www.ecovluu.com/blog/" . rawurlencode($slug);

$posts = json_decode($response, true);

if ($httpCode === 200 && !empty($posts) && isset($posts[0])) {
    $post = $posts[0];
    
    $title = htmlspecialchars($post['title']);
    $descText = $post['excerpt'] ? $post['excerpt'] : substr($post['content'], 0, 160);
    $description = htmlspecialchars($descText);
    
    $rawImage = $post['image'];
    if (strpos($rawImage, 'http') !== 0) {
         $rawImage = 'https://www.ecovluu.com' . $rawImage;
    }
    $imageUrl = htmlspecialchars($rawImage);
} 
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $title; ?> | ECOVLUU Blog</title>
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article" />
    <meta property="og:url" content="<?php echo $shareUrl; ?>" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:description" content="<?php echo $description; ?>" />
    <meta property="og:image" content="<?php echo $imageUrl; ?>" />
    <meta property="og:site_name" content="ECOVLUU" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="<?php echo $title; ?>" />
    <meta name="twitter:description" content="<?php echo $description; ?>" />
    <meta name="twitter:image" content="<?php echo $imageUrl; ?>" />
    
    <!-- Redirect to actual React App -->
    <script type="text/javascript">
        // Decode the slug back for the JS redirect so the URL looks nice
        var slug = <?php echo json_encode($slug); ?>;
        // We use the cleaned URL for the redirect
        window.location.href = "https://www.ecovluu.com/blog/" + encodeURIComponent(slug);
    </script>
</head>
<body>
    <h1><?php echo $title; ?></h1>
    <img src="<?php echo $imageUrl; ?>" alt="<?php echo $title; ?>" style="max-width: 500px;">
    <p><?php echo $description; ?></p>
    
    <p>Loading article...</p>
    <script>
        setTimeout(function() {
             var slug = <?php echo json_encode($slug); ?>;
             window.location.href = "https://www.ecovluu.com/blog/" + encodeURIComponent(slug);
        }, 1000);
    </script>
</body>
</html>
