activate :automatic_image_sizes

configure :development do
  activate :livereload
end

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
set :relative_links, true

configure :build do
  # activate :minify_css
  # activate :minify_javascript
  activate :asset_hash
  activate :relative_assets
end
