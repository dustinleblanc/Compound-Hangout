before 'protect from forgery', ->
  protectFromForgery '38d9dd8a0f83134230ffaaadc6dec096ffb9c0d8'

before requireManager = ->
  User.find session.passport.user, (err, user) ->
    console.log user
    if user
      req.user = user
    else
      redirect "/auth/google"
    next()
    return

  return
