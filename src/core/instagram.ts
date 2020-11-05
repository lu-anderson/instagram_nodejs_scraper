import fs from 'fs'
import path from 'path'
import axios from 'axios'


import endpoints from './endpoints'
import userAgents from './userAgents'



class Instagram {
    private userAgent = userAgents.ChromeDesktop

    public async login(username: String, password: String, saveSession = false) {
        try {
            let response = await axios.get(endpoints.BASE_URL)

            let csrftoken = response.headers['set-cookie'].find((cookie: String) => cookie.match('csrftoken='))
                .split(';')[0].split('=')[1]

            let mid = response.headers['set-cookie'].find((cookie: String) => cookie.match('mid='))
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

                const cookies = {
                    csrftoken,
                    ds_user_id,
                    ig_did,
                    rur,
                    sessionid,
                    mid
                }

                if (saveSession) {
                    fs.writeFileSync(path.resolve(__dirname, `../sessions/${username}.json`), JSON.stringify(cookies))
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

            return response.data.graphql.user.id
        } catch (error) {
            console.log('Error in getIdByUsername')
            console.log(error)
        }
    }

    public async followByUsername(username: String) {
        try {
            const headers = this.generateHeaders()
            const id = await this.getIdByUsername(username)
            console.log(id)

            const url = endpoints.FOLLOW_URL(id)
            console.log(url)
            const response = await axios({
                method: 'post',
                url: url,
                headers
            })

            if(response.status == 200){
                console.log(`Sucess in following the ${username}`)
            } else {
                console.log(response)
            }            
        } catch (error) {
            console.log('Error in followByUsername')
            console.log(error)
        }
    }

    private async getIdByShortcode(){
        
    }

    private async likeByShortcode(shortcode: String){
        const headers = this.generateHeaders()
        const id = ''
    }
}

export default Instagram



