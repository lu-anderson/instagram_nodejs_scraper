import fs from 'fs'
import path from 'path'
import axios from 'axios'


import endpoints from './endpoints'
import userAgents from './userAgents'


interface Cookies {
    csrftoken: string,
    ds_user_id: string,
    ig_did: string,
    rur: string,
    sessionid: string,
    mid: string
}
class Instagram {
    private userAgent = userAgents.ChromeDesktop

    public async login(username: string, password: string, saveSession = false) {
        try {
            let response = await axios.get(endpoints.BASE_URL)

            let csrftoken = response.headers['set-cookie'].find((cookie: string) => cookie.match('csrftoken='))
                .split(';')[0].split('=')[1]

            let mid = response.headers['set-cookie'].find((cookie: string) => cookie.match('mid='))
                .split(';')[0].split('=')[1]

            const headers = {
                'cookie': `ig_cb=1; csrftoken=${csrftoken}; mid=${mid};`,
                'referer': endpoints.BASE_URL + '/',
                'x-csrftoken': csrftoken,
                'X-CSRFToken': csrftoken,
                'user-agent': this.userAgent
            }

            const payload = `username=${username}&enc_password=${encodeURIComponent(`#PWD_INSTAGRAM_BROWSER:0:${Math.ceil((new Date().getTime() / 1000))}:${password}`)}`

            response = await axios({
                method: 'post',
                url: endpoints.LOGIN_URL,
                data: payload,
                headers
            })

            if (!response.data.user) {
                throw { error: 'User not found' }
            } else if (!response.data.authenticated) {
                throw { error: 'Password is wrong' }
            } else {
                console.log('Success in login')

                csrftoken = response.headers['set-cookie'].find((cookie: String) => cookie.match('csrftoken='))
                    .split(';')[0]

                let ds_user_id = response.headers['set-cookie'].find((cookie: String) => cookie.match('ds_user_id='))
                    .split(';')[0].split('=')[1]

                let ig_did = response.headers['set-cookie'].find((cookie: String) => cookie.match('ig_did='))
                    .split(';')[0].split('=')[1]

                let rur = response.headers['set-cookie'].find((cookie: String) => cookie.match('rur='))
                    .split(';')[0].split('=')[1]

                let sessionid = response.headers['set-cookie'].find((cookie: String) => cookie.match('sessionid='))
                    .split(';')[0].split('=')[1]

                const cookies: Cookies = {
                    csrftoken,
                    ds_user_id,
                    ig_did,
                    rur,
                    sessionid,
                    mid
                }

                if (saveSession) {
                    await this.saveSession(username, cookies)
                }

                return cookies
            }
        } catch (error) {
            console.log(error)
            if (error.response.data.message = 'checkpoint_required') {
                console.log('Account blocked')
            }
        }
    }

    public async saveSession(username: string, cookies: Cookies) {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(path.join(path.resolve(__dirname, `../sessions/${username}.json`)), JSON.stringify(cookies), (err) => {
                if (err) reject(reject)
                resolve()
            })
        })
    }

    private generateHeaders() {
        const cookiesJson = require('../sessions/gabriel.levistiky.json')
        let cookies = ''

        Object.keys(cookiesJson).forEach(key => {
            cookies += `${key}=${cookiesJson[key]}; `
        })

        const csrf = cookiesJson['csrftoken']

        const headers = {
            'cookie': cookies,
            'referer': endpoints.BASE_URL + '/',
            'x-csrftoken': csrf,
            'user-agent': this.userAgent
        }

        return headers
    }

    public async getIdByUsername(username: String) {
        try {
            const headers = this.generateHeaders()
            const response = await axios({
                method: 'get',
                url: endpoints.ACCOUNT_JSON_INFO(username),
                headers
            })
            const id: number = response.data.graphql.user.id

            return id
        } catch (error) {
            throw new Error('Error in getIdByUsername')
        }
    }

    public async followByUserID(id: number) {
        const headers = this.generateHeaders()
        const url = endpoints.FOLLOW_URL(id)
        console.log(url)
        const response = await axios({
            method: 'post',
            url: url,
            headers
        })

        if (response.status == 200) {
            console.log(`Sucess in following`)
        } else {
            console.log(response)
        }
    }
    public async followByUsername(username: String) {
        try {
            const id = await this.getIdByUsername(username)
            await this.followByUserID(id)


        } catch (error) {
            console.log('Error in followByUsername')
            console.log(error)
        }
    }

    private async getIdByShortcode() {

    }

    private async likeByShortcode(shortcode: String) {
        const headers = this.generateHeaders()
        const id = ''
    }
}

export default Instagram



