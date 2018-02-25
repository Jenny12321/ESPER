/* global require */
var request = require('request');
var Speaker = require('speaker');
var wav = require('wav');
var xmlbuilder = require('xmlbuilder');

(function(){
    
    "use strict";
    
    this.Synthesize = function() {
        var ssmlString = xmlbuilder.create('speak')
                 .att('version', '1.0')
                 .att('xml:lang', 'en-us')
                 .ele('voice')
                 .att('xml:lang', 'en-us')
                 .att('xml:gender', 'Female')
                 .att('name', 'Microsoft Server Speech Text to Speech Voice (en-US, ZiraRUS)')
                 .ele('prosody')
                 .att('rate', '-10.00%')
                 .txt('Hi my name is Zira')
                 .end().toString();

        request.post({
            url: 'https://api.cognitive.microsoft.com/sts/v1.0/issueToken',
            headers: {
                'Ocp-Apim-Subscription-Key' : "30f9e601bedb4f59916b6fd7f3d20624"
            }
        }, function (error, response, access_token) {
            request.post({
                url: 'https://speech.platform.bing.com/synthesize',
                body: ssmlString,
                headers: {
                    'content-type' : 'application/ssml+xml',
                    'X-Microsoft-OutputFormat' : 'riff-16khz-16bit-mono-pcm',
                    'X-Search-AppId': 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                    'X-Search-ClientID': 'FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF',
                    'User-Agent': 'TextToSpeech',
                    'Authorization': 'Bearer ' + access_token
                },
                encoding: null
            }, function (error, response, speak_data) {
                var reader = new wav.Reader();
                reader.on('format', function (format) {
                    reader.pipe(new Speaker(format));
                });
                var Readable = require('stream').Readable;
                var s = new Readable();
                s.push(speak_data);
                s.push(null);
                s.pipe(reader);
            });
        });
    }();
}).call(this);