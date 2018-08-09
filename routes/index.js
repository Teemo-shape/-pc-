
const Router = require('koa-router');
const home = require('./home');
const sign = require('./login');
const forget = require('./forget');
const applyAccount = require('./applyAccount');
const search = require('./search');
const channel = require('./channel');

const header = require('./headerapi');

const policy = require('./policy');
const ueCenter = require('./ueCenter');

const liveVideo = require('./liveVideo');
const p5Eva = require('./p5Eva');

const router = new Router();


router.use('/',home.routes(), home.allowedMethods());
router.use('/forget',forget.routes(), forget.allowedMethods());
router.use('/applyAccount',applyAccount.routes(), applyAccount.allowedMethods());
router.use('/sign',sign.routes(), sign.allowedMethods());
router.use('/:channelName',channel.routes(), channel.allowedMethods());
router.use('/api/html/header', header.routes(), header.allowedMethods());
router.use('/page/serviceRevision/policy', policy.routes(), policy.allowedMethods());

//developing

//router.use('/page/ueCenter/ueCenter', ueCenter.routes(), ueCenter.allowedMethods());
router.use('/page/liveVideo/index', liveVideo.routes(), liveVideo.allowedMethods());
router.use('/page/p5/index', p5Eva.routes(), p5Eva.allowedMethods());

module.exports = router;
