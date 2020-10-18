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
    login(username, password, saveSession = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let response = yield axios_1.default.get(endpoints_1.default.BASE_URL);
                let csrftoken = response.headers['set-cookie'].find((cookie) => cookie.match('csrftoken='))
                    .split(';')[0].split('=')[1];
                console.log(csrftoken);
                let mid = response.headers['set-cookie'].find((cookie) => cookie.match('mid='))
                    .split(';')[0].split('=')[1];
                const headers = {
                    'cookie': `ig_cb=1; csrftoken=${csrftoken}; mid=${mid};`,
                    'referer': endpoints_1.default.BASE_URL + '/',
                    'x-csrftoken': csrftoken,
                    'X-CSRFToken': csrftoken,
                    //'user-agent': userAgent.Instagram_155_in_Android_9_Samsung_SM_A102U
                    'user-agent': userAgents_1.default.ChromeDesktop
                };
                const payload = `username=${username}&enc_password=${encodeURIComponent(`#PWD_INSTAGRAM_BROWSER:0:${Math.ceil((new Date().getTime() / 1000))}:${password}`)}`;
                console.log(payload);
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
                    console.log(response.data);
                    console.log(response.headers);
                    //{"3D64224D-5397-407E-9084-CF16C7D6C5E3","rur":"PRN","sessionid":"40017536730%3ApAfLjbLn5dNrpo%3A14","mid":"X4YaeQAEAAGtA9-_h64tX_WDna0D"}
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
                    if (saveSession) {
                        fs_1.default.writeFileSync(path_1.default.resolve(__dirname, `../sessions/${username}.json`), JSON.stringify(cookies));
                    }
                    return cookies;
                }
            }
            catch (error) {
                throw error;
            }
        });
    }
}
exports.default = Instagram;