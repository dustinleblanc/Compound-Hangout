exports.routes = (map)->
  map.resources 'users'

  map.resources 'hangouts'

  # Generic routes. Add all your routes below this line
  # feel free to remove generic routes
  map.all ':controller/:action'
  map.all ':controller/:action/:id'

  map.get '/', 'hangouts#index'
  map.get 'logout', 'passport#logout'
