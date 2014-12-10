var app, compound
, request = require('supertest')
, sinon   = require('sinon');

function HangoutStub () {
    return {
        name: ''
    };
}

describe('HangoutController', function() {
    beforeEach(function(done) {
        app = getApp();
        compound = app.compound;
        compound.on('ready', function() {
            done();
        });
    });

    /*
     * GET /hangouts/new
     * Should render hangouts/new.ejs
     */
    it('should render "new" template on GET /hangouts/new', function (done) {
        request(app)
        .get('/hangouts/new')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/hangouts\/new\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /hangouts
     * Should render hangouts/index.ejs
     */
    it('should render "index" template on GET /hangouts', function (done) {
        request(app)
        .get('/hangouts')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didRender(/hangouts\/index\.ejs$/i).should.be.true;
            done();
        });
    });

    /*
     * GET /hangouts/:id/edit
     * Should access Hangout#find and render hangouts/edit.ejs
     */
    it('should access Hangout#find and render "edit" template on GET /hangouts/:id/edit', function (done) {
        var Hangout = app.models.Hangout;

        // Mock Hangout#find
        Hangout.find = sinon.spy(function (id, callback) {
            callback(null, new Hangout);
        });

        request(app)
        .get('/hangouts/42/edit')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Hangout.find.calledWith('42').should.be.true;
            app.didRender(/hangouts\/edit\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * GET /hangouts/:id
     * Should render hangouts/index.ejs
     */
    it('should access Hangout#find and render "show" template on GET /hangouts/:id', function (done) {
        var Hangout = app.models.Hangout;

        // Mock Hangout#find
        Hangout.find = sinon.spy(function (id, callback) {
            callback(null, new Hangout);
        });

        request(app)
        .get('/hangouts/42')
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Hangout.find.calledWith('42').should.be.true;
            app.didRender(/hangouts\/show\.ejs$/i).should.be.true;

            done();
        });
    });

    /*
     * POST /hangouts
     * Should access Hangout#create when Hangout is valid
     */
    it('should access Hangout#create on POST /hangouts with a valid Hangout', function (done) {
        var Hangout = app.models.Hangout
        , hangout = new HangoutStub;

        // Mock Hangout#create
        Hangout.create = sinon.spy(function (data, callback) {
            callback(null, hangout);
        });

        request(app)
        .post('/hangouts')
        .send({ "Hangout": hangout })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            Hangout.create.calledWith(hangout).should.be.true;

            done();
        });
    });

    /*
     * POST /hangouts
     * Should fail when Hangout is invalid
     */
    it('should fail on POST /hangouts when Hangout#create returns an error', function (done) {
        var Hangout = app.models.Hangout
        , hangout = new HangoutStub;

        // Mock Hangout#create
        Hangout.create = sinon.spy(function (data, callback) {
            callback(new Error, hangout);
        });

        request(app)
        .post('/hangouts')
        .send({ "Hangout": hangout })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            Hangout.create.calledWith(hangout).should.be.true;

            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * PUT /hangouts/:id
     * Should redirect back to /hangouts when Hangout is valid
     */
    it('should redirect on PUT /hangouts/:id with a valid Hangout', function (done) {
        var Hangout = app.models.Hangout
        , hangout = new HangoutStub;

        Hangout.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(null) }
            });
        });

        request(app)
        .put('/hangouts/1')
        .send({ "Hangout": hangout })
        .end(function (err, res) {
            res.statusCode.should.equal(302);
            res.header['location'].should.include('/hangouts/1');

            app.didFlash('error').should.be.false;

            done();
        });
    });

    /*
     * PUT /hangouts/:id
     * Should not redirect when Hangout is invalid
     */
    it('should fail / not redirect on PUT /hangouts/:id with an invalid Hangout', function (done) {
        var Hangout = app.models.Hangout
        , hangout = new HangoutStub;

        Hangout.find = sinon.spy(function (id, callback) {
            callback(null, {
                id: 1,
                updateAttributes: function (data, cb) { cb(new Error) }
            });
        });

        request(app)
        .put('/hangouts/1')
        .send({ "Hangout": hangout })
        .end(function (err, res) {
            res.statusCode.should.equal(200);
            app.didFlash('error').should.be.true;

            done();
        });
    });

    /*
     * DELETE /hangouts/:id
     * -- TODO: IMPLEMENT --
     */
    it('should delete a Hangout on DELETE /hangouts/:id');

    /*
     * DELETE /hangouts/:id
     * -- TODO: IMPLEMENT FAILURE --
     */
    it('should not delete a Hangout on DELETE /hangouts/:id if it fails');
});
