"use strict";
var Answer = (function () {
    function Answer(response) {
        this.response = response;
    }
    Answer.prototype.send = function (data) {
        this.response.json({ "result": data });
    };
    return Answer;
}());
exports.Answer = Answer;

//# sourceMappingURL=INodeClient.js.map
