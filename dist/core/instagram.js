"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const endpoints_1 = __importDefault(require("./endpoints"));
const userAgents_1 = __importDefault(require("./userAgents"));
class Instagram {
    /**
     *
     * @param username Usuário para fazer login
     * @param password Senha para fazer login
     */
    constructor(username, password) {
        this.userAgent = userAgents_1.default.ChromeDesktop;
        this.headers = {};
        this.ownerUsername = username;
        this.ownerPassword = password;
    }
    /**
     *
     * @param force Forçar um novo login
     */
    login(force) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hasSessionSaved = yield this.checkIfFileExists(path_1.default.resolve(__dirname, `../sessions/${this.ownerUsername}.json`));
                if (!hasSessionSaved || force) {
                    let response = yield axios_1.default.get(endpoints_1.default.BASE_URL);
                    let csrftoken = response.headers['set-cookie'].find((cookie) => cookie.match('csrftoken='))
                        .split(';')[0].split('=')[1];
                    let mid = response.headers['set-cookie'].find((cookie) => cookie.match('mid='))
                        .split(';')[0].split('=')[1];
                    const headers = {
                        'cookie': `ig_cb=1; csrftoken=${csrftoken}; mid=${mid};`,
                        'referer': endpoints_1.default.BASE_URL + '/',
                        'x-csrftoken': csrftoken,
                        'X-CSRFToken': csrftoken,
                        'user-agent': this.userAgent
                    };
                    const payload = `username=${this.ownerUsername}&enc_password=${encodeURIComponent(`#PWD_INSTAGRAM_BROWSER:0:${Math.ceil((new Date().getTime() / 1000))}:${this.ownerPassword}`)}`;
                    response = yield axios_1.default({
                        method: 'post',
                        url: endpoints_1.default.LOGIN_URL,
                        data: payload,
                        headers
                    });
                    if (!response.data.user) {
                        throw { error: 'User not found' };
                    }
                    else if (!response.data.authenticated) {
                        throw { error: 'Password is wrong' };
                    }
                    else {
                        console.log('Success in login');
                        csrftoken = response.headers['set-cookie'].find((cookie) => cookie.match('csrftoken='))
                            .split(';')[0];
                        let ds_user_id = response.headers['set-cookie'].find((cookie) => cookie.match('ds_user_id='))
                            .split(';')[0].split('=')[1];
                        let ig_did = response.headers['set-cookie'].find((cookie) => cookie.match('ig_did='))
                            .split(';')[0].split('=')[1];
                        let rur = response.headers['set-cookie'].find((cookie) => cookie.match('rur='))
                            .split(';')[0].split('=')[1];
                        let sessionid = response.headers['set-cookie'].find((cookie) => cookie.match('sessionid='))
                            .split(';')[0].split('=')[1];
                        const cookies = {
                            csrftoken,
                            ds_user_id,
                            ig_did,
                            rur,
                            sessionid,
                            mid
                        };
                        let cookiesString = '';
                        Object.keys(cookies).forEach(key => {
                            cookiesString += `${key}=${cookies[key]}; `;
                        });
                        const csrf = cookies.csrftoken;
                        const headers = {
                            'cookie': cookiesString,
                            'referer': endpoints_1.default.BASE_URL + '/',
                            'x-csrftoken': csrf,
                            'user-agent': this.userAgent
                        };
                        this.headers = headers;
                        yield this.saveSession(cookies);
                    }
                }
                else {
                    this.generateHeaders();
                }
            }
            catch (error) {
                console.log(error);
                if (error.response.data.message = 'checkpoint_required') {
                    console.log('Account blocked');
                }
            }
        });
    }
    checkIsLogged() {
        if (Object.keys(this.headers).length === 0) {
            throw new Error('Please login first');
        }
    }
    checkIfFileExists(pathToFile) {
        return new Promise((resolve, reject) => {
            fs_1.default.stat(pathToFile, (err, stats) => {
                if (!err && stats.isFile()) {
                    resolve(true);
                }
                if (err && err.code === 'ENOENT') {
                    resolve(false);
                }
                if (err)
                    reject(err);
            });
        });
    }
    saveSession(cookies) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.writeFile(path_1.default.join(path_1.default.resolve(__dirname, `../sessions/${this.ownerUsername}.json`)), JSON.stringify(cookies), (err) => {
                    if (err)
                        reject(reject);
                    resolve();
                });
            });
        });
    }
    generateHeaders() {
        const cookiesJson = require(`../sessions/${this.ownerUsername}.json`);
        let cookies = '';
        Object.keys(cookiesJson).forEach(key => {
            cookies += `${key}=${cookiesJson[key]}; `;
        });
        const csrf = cookiesJson['csrftoken'];
        const headers = {
            'cookie': cookies,
            'referer': endpoints_1.default.BASE_URL + '/',
            'x-csrftoken': csrf,
            'user-agent': this.userAgent
        };
        this.headers = headers;
    }
    getIdByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkIsLogged();
                const response = yield axios_1.default({
                    method: 'get',
                    url: endpoints_1.default.ACCOUNT_JSON_INFO(username),
                    headers: this.headers
                });
                const id = response.data.graphql.user.id;
                return id;
            }
            catch (error) {
                throw new Error('Error in getIdByUsername');
            }
        });
    }
    followByUserID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkIsLogged();
                const url = endpoints_1.default.FOLLOW_URL(id);
                const response = yield axios_1.default({
                    method: 'post',
                    url: url,
                    headers: this.headers
                });
                if (response.status == 200) {
                    console.log(`Success in following`);
                }
                else {
                    console.log(response);
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
    followByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.checkIsLogged();
                const id = yield this.getIdByUsername(username);
                yield this.followByUserID(id);
            }
            catch (error) {
                throw error;
            }
        });
    }
    getIdByShortcode() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    likeByShortcode(shortcode) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = this.generateHeaders();
            const id = '';
        });
    }
}
exports.default = Instagram;
