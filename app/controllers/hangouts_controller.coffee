load 'application'

before 'load hangout', ->
  Hangout.find params.id, (err, hangout) =>
    if err || !hangout
      if !err && !hangout && params.format == 'json'
        return send code: 404, error: 'Not found'
      redirect pathTo.hangouts
    else
      @hangout = hangout
      next()
, only: ['show', 'edit', 'update', 'destroy']

action 'new', ->
  @hangout = new Hangout
  @title = 'New hangout'
  render()

action 'create', ->
  Hangout.create body.Hangout, (err, hangout) =>
    respondTo (format) =>
      format.json ->
        if err
          send code: 500, error: hangout.errors || err
        else
          send code: 200, data: hangout.toObject()
      format.html =>
        if err
          flash 'error', 'Hangout can not be created'
          @hangout = hangout
          @title = 'New hangout'
          render 'new'
        else
          flash 'info', 'Hangout created'
          redirect pathTo.hangouts

action 'index', ->
  Hangout.all (err, hangouts) =>
    @hangouts = hangouts
    @title = 'Hangout index'
    respondTo (format) ->
      format.json ->
        send code: 200, data: hangouts
      format.html ->
        render hangouts: hangouts

action 'show', ->
  @title = 'Hangout show'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @hangout
    format.html ->
      render()

action 'edit', ->
  @title = 'Hangout edit'
  respondTo (format) =>
    format.json =>
      send code: 200, data: @hangout
    format.html ->
      render()

action 'update', ->
  @hangout.updateAttributes body.Hangout, (err) =>
    respondTo (format) =>
      format.json =>
        if err
          send code: 500, error: @hangout.errors || err
        else
          send code: 200, data: @hangout
      format.html =>
        if !err
          flash 'info', 'Hangout updated'
          redirect path_to.hangout(@hangout)
        else
          flash 'error', 'Hangout can not be updated'
          @title = 'Edit hangout details'
          render 'edit'

action 'destroy', ->
  @hangout.destroy (error) ->
    respondTo (format) ->
      format.json ->
        if error
          send code: 500, error: error
        else
          send code: 200
      format.html ->
        if error
          flash 'error', 'Can not destroy hangout'
        else
          flash 'info', 'Hangout successfully removed'
        send "'" + path_to.hangouts + "'"
