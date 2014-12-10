# Example of model definition:
#
#define 'User', ->
#  property 'email', String, index: true
#  property 'password', String
#  property 'activated', Boolean, default: false
#

Hangout = describe 'Hangout', ->
    property 'name', String
    set 'restPath', pathTo.hangouts

User = describe 'User', ->
    property 'name', String
    property 'password', String
    property 'email', String
    set 'restPath', pathTo.users

