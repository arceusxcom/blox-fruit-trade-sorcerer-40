<?php
/*
Plugin Name: Blox Fruits Calculator
Description: A calculator for Blox Fruits trading values
Version: 1.0
Author: Your Name
*/

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Register activation hook
register_activation_hook(__FILE__, 'bfc_activate_plugin');

function bfc_activate_plugin() {
    // Create uploads directory for fruits if it doesn't exist
    $upload_dir = wp_upload_dir();
    $fruits_dir = $upload_dir['basedir'] . '/fruits';
    
    if (!file_exists($fruits_dir)) {
        wp_mkdir_p($fruits_dir);
        
        // Copy fruit images from plugin directory to uploads
        $plugin_fruits_dir = plugin_dir_path(__FILE__) . 'public/fruits/';
        if (is_dir($plugin_fruits_dir)) {
            $files = glob($plugin_fruits_dir . '*');
            foreach ($files as $file) {
                if (is_file($file)) {
                    copy($file, $fruits_dir . '/' . basename($file));
                }
            }
        }
    }
}

// Enqueue scripts and styles
function bfc_enqueue_scripts() {
    // Get the plugin directory URL
    $plugin_url = plugins_url('', __FILE__);
    
    // Get file paths for versioning
    $css_file = plugin_dir_path(__FILE__) . 'dist/assets/index.css';
    $js_file = plugin_dir_path(__FILE__) . 'dist/assets/index.js';
    
    // Enqueue the CSS file with version parameter
    wp_enqueue_style(
        'bfc-styles',
        $plugin_url . '/dist/assets/index.css',
        array(),
        file_exists($css_file) ? filemtime($css_file) : '1.0.0'
    );
    
    // Enqueue React and ReactDOM from WordPress
    wp_enqueue_script('wp-element');
    
    // Enqueue the JS file with version parameter
    wp_enqueue_script(
        'bfc-scripts',
        $plugin_url . '/dist/assets/index.js',
        array('wp-element'),
        file_exists($js_file) ? filemtime($js_file) : '1.0.0',
        true
    );

    // Localize script with necessary data
    wp_localize_script('bfc-scripts', 'bfcData', array(
        'pluginUrl' => $plugin_url,
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('bfc_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'bfc_enqueue_scripts');

// Register shortcode
function bfc_shortcode() {
    ob_start();
    ?>
    <div id="blox-fruits-calculator-root"></div>
    <?php
    return ob_get_clean();
}
add_shortcode('blox_fruits_calculator', 'bfc_shortcode');

// Add menu item to WordPress admin
function bfc_admin_menu() {
    add_menu_page(
        'Blox Fruits Calculator',
        'Blox Calculator',
        'manage_options',
        'blox-fruits-calculator',
        'bfc_admin_page'
    );
}
add_action('admin_menu', 'bfc_admin_menu');

// Admin page content
function bfc_admin_page() {
    ?>
    <div class="wrap">
        <h1>Blox Fruits Calculator</h1>
        <p>Use the shortcode <code>[blox_fruits_calculator]</code> to display the calculator on any page or post.</p>
        <h2>Instructions:</h2>
        <ol>
            <li>Add the shortcode <code>[blox_fruits_calculator]</code> to any page or post where you want the calculator to appear.</li>
            <li>The calculator will work with any permalink structure.</li>
            <li>Fruit images are stored in your WordPress uploads directory under /fruits/.</li>
        </ol>
    </div>
    <?php
}