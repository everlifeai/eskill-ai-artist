'use strict'
const cote = require('cote')({statusLogsEnabled:false})
const u = require('elife-utils')
const request = require('request')

/*      understand/
 * This is the main entry point where we start.
 *
 *      outcome/
 * Start our microservice and register with the communication manager.
 */
function main() {
    setReqURL()
    startMicroservice()
    registerWithCommMgr()
}

/*      outcome/
 * Use environment variable configuration to create the URL for the
 * service to which we will make our AI Artist request.
 */
let AIARTIST_URL
function setReqURL() {
    if(!process.env.AIARTIST_HOST || !process.env.AIARTIST_PORT) return
    AIARTIST_URL = `http://${process.env.AIARTIST_HOST}:${process.env.AIARTIST_PORT}/draw`
}

const commMgrClient = new cote.Requester({
    name: 'AI Artist -> CommMgr',
    key: 'everlife-communication-svc',
})

function sendReply(msg, req) {
    req.type = 'reply'
    req.msg = msg
    commMgrClient.send(req, (err) => {
        if(err) u.showErr(err)
    })
}

let msKey = 'everlife-ai-artist-demo-svc'
/*      outcome/
 * Register ourselves as a message handler with the communication
 * manager so we can handle requests for drawing pics.
 */
function registerWithCommMgr() {
    commMgrClient.send({
        type: 'register-msg-handler',
        mskey: msKey,
        mstype: 'msg',
        mshelp: [ { cmd: '/style_pic', txt: '(muse/rain/scream/udnie/wave/wreck) - Artistically redraw an image in the given style' } ],
    }, (err) => {
        if(err) u.showErr(err)
    })
}

function startMicroservice() {

    /*      understand/
     * The microservice (partitioned by key to prevent conflicting with
     * other services).
     */
    const svc = new cote.Responder({
        name: 'Everlife AI Artist Service Demo',
        key: msKey,
    })

    /*      outcome/
     * Respond to user messages asking us to redraw an image in the
     * given style by asking for the image then drawing it.
     */
    svc.on('msg', (req, cb) => {
        if(askedForService) {
            askedForService = false
            cb(null, true)
            draw(style, req.msg, (err, outfile) => {
                if(err) {
                    sendReply(err, req)
                    u.showErr(err)
                } else {
                    sendReply(outfile, req)
                }
            })
        } else {
            let msg = req.msg
            if(!msg) return cb()
            if(msg.startsWith('/style_pic ')) {
                if(!AIARTIST_URL) {
                    cb(null, true)
                    sendReply("AIARTIST_HOST or AIARTIST_PORT has not been set. I cannot draw...", req)
                } else {
                    askedForService = true
                    style = msg.substring('/style_pic '.length)
                    cb(null, true)
                    sendReply("What's the path to the picture?", req)
                }
            } else {
                cb()
            }
        }
    })
}

/*      understand/
 * We keep context here - if the user has asked for our service or not.
 * TODO: Save state in leveldb service
 */
let askedForService;
let style;

/*      outcome/
 * Make a request to the AI Artist service
 */
function draw(style, imgpath, cb) {
    let options = {
        url: AIARTIST_URL,
        qs: { style: style, imgpath: imgpath },
    }
    request.get(options, (err, res, body) => {
        if(err) cb(err)
        else {
            cb(null, body)
        }
    })
    cb(null, "Let me check...")
}

main()

