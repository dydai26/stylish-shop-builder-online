<?php
// share.php - Proxy for Facebook Crawler
// Serves static HTML with Open Graph tags for Facebook/social bots.

// 1. Get the slug
$slug = isset($_GET['slug']) ? $_GET['slug'] : '';

// 2. Validate/Sanitize slug
// Allow alphanumeric, dashes, and UNDERSCORES.
$slug = preg_replace('/[^a-z0-9-_]/i', '', $slug);

if (empty($slug)) {
    // No slug? Redirect to blog home
    header("Location: /blog");
    exit;
}

// 3. Supabase Config
$supabaseUrl = "https://inivoiunisrgdinrcquu.supabase.co";
$supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImluaXZvaXVuaXNyZ2RpbnJjcXV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNzY0OTgsImV4cCI6MjA1OTg1MjQ5OH0.Ruox-xcKxcirSSmTsNHpPIXqUyFCApZOisJViI_Hp1w";

// 4. Fetch Post Data
$url = $supabaseUrl . "/rest/v1/blog_posts?slug=eq." . $slug . "&select=*";

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
// Increase timeout
curl_setopt($ch, CURLOPT_TIMEOUT, 10);
// Handle SSL verification issues if any (safe for this specific read-only op)
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "apikey: " . $supabaseKey,
    "Authorization: Bearer " . $supabaseKey
));

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
curl_close($ch);

// 5. Parse Data
$title = "ECOVLUU Blog";
$description = "Read our latest article on ECOVLUU.";
$imageUrl = "https://www.ecovluu.com/ecovluu-logo.png"; // Fallback image
$articleUrl = "https://www.ecovluu.com/blog/" . $slug;

$posts = json_decode($response, true);

if ($httpCode === 200 && !empty($posts) && isset($posts[0])) {
    $post = $posts[0];
    
    // Success: use post data
    $title = htmlspecialchars($post['title']);
    $descText = $post['excerpt'] ? $post['excerpt'] : substr($post['content'], 0, 160);
    $description = htmlspecialchars($descText);
    
    $rawImage = $post['image'];
    if (strpos($rawImage, 'http') !== 0) {
         $rawImage = 'https://www.ecovluu.com' . $rawImage;
    }
    $imageUrl = htmlspecialchars($rawImage);
} else {
    // If we fail to find the post, we might want to still redirect to the blog post URL
    // so the user sees the 404 on the React app, OR redirect to blog index.
    // However, for Facebook crawler, if we return generic tags, it's better than nothing.
    // Let's stick to the article URL so at least it clicks through correctly.
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
    <meta property="og:url" content="<?php echo $articleUrl; ?>" />
    <meta property="og:title" content="<?php echo $title; ?>" />
    <meta property="og:description" content="<?php echo $description; ?>" />
    <meta property="og:image" content="<?php echo $imageUrl; ?>" />
    <meta property="og:site_name" content="ECOVLUU" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="<?php echo $articleUrl; ?>" />
    <meta property="twitter:title" content="<?php echo $title; ?>" />
    <meta property="twitter:description" content="<?php echo $description; ?>" />
    <meta property="twitter:image" content="<?php echo $imageUrl; ?>" />
    
    <!-- Redirect to actual content -->
    <script type="text/javascript">
        window.location.href = "<?php echo $articleUrl; ?>";
    </script>
</head>
<body>
    <p>Redirecting to <a href="<?php echo $articleUrl; ?>"><?php echo $title; ?></a>...</p>
</body>
</html>
