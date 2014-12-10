load 'application'

before 'load user', ->
  User.find params.id, (err, user) =>
    if err || !user
      if !err && !user && params.format == 'json'
        return send code: 404, error: 'Not found'
      redirect pathTo.users
    else
      @user = user
      next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
  @user = new User
  @title = 'New user'
  render()

action 'create', ->
  User.create body.User, (err, user) =>
    respondTo (format) =>
      format.json ->
        if err
          send code: 500, error: user.errors || err
        else
          send code: 200, data: user.toObject()
      format.html =>
        if err
          flash 'error', 'User can not be created'
          @user = user
          @title = 'New user'
          render 'new'
        else
          flash 'info', 'User created'
          redirect pathTo.users

action 'index', ->
  User.all (err, users) =>
    @users = users
    @title = 'User index'
    respondTo (format) ->
      format.json ->
        send code: 200, data: users
      format.html ->
        render users: users

action 'show', ->
  @title = 'User show'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @user
    format.html ->
      render()

action 'edit', ->
  @title = 'User edit'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @user
    format.html ->
      render()

action 'update', ->
  @user.updateAttributes body.User, (err) =>
    respondTo (format) =>
      format.json =>
        if err
          send code: 500, error: @user.errors || err
        else
          send code: 200, data: @user
      format.html =>
        if !err
          flash 'info', 'User updated'
          redirect path_to.user(@user)
        else
          flash 'error', 'User can not be updated'
          @title = 'Edit user details'
          render 'edit'

action 'destroy', ->
  @user.destroy (error) ->
    respondTo (format) ->
      format.json ->
        if error
          send code: 500, error: error
        else
          send code: 200
      format.html ->
        if error
          flash 'error', 'Can not destroy user'
        else
          flash 'info', 'User successfully removed'
        send "'" + path_to.users + "'"
