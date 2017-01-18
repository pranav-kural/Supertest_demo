var expect = require('chai').expect;
var request = require("supertest");
var cheerio = require("cheerio");
var rewire = require('rewire');
var app = rewire('../app');

describe("Dictionary App", function () {

    it("Loads the home page", function(done) {
        request(app).get("/").expect(200).end(function(err, res) {
            var $ = cheerio.load(res.text);
            var pageHeading = $("body>h1:first-child").text();
            expect(pageHeading).to.equal("Skier Dictionary");
            done();
        });
    });

    describe("Dictionary API", function () {

        beforeEach(function () {

        	this.defs = [
                {
                    term: "One",
                    defined: "Term One Defined"
                },
                {
                    term: "Two",
                    defined: "Term Two Defined"
                }
            ];

            app.__set__("skierTerms", this.defs);
        });

        it("GETS dictionary-api", function(done) {
            defs = this.defs;
            request(app).get("/dictionary-api").expect(200).end(function(err, res) {
                var data_received = JSON.parse(res.text);
                expect(data_received).to.deep.equal(defs);
                done();
            });
        });

        it("POSTS dictionary-api", function(done) {
            request(app)
            .post("/dictionary-api")
            .send({ "term": "Third", "defined": "Term Third Defined" })
            .expect(200)
            .end(done);            
        });

    it("DELETES dictionary-api", function(done) {
            request(app)
            .delete("/dictionary-api/One")
            .expect(200)
            .end(done);
    });

    });

});