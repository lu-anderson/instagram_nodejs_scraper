import fs from 'fs'
import path from 'path'
import axios from 'axios'


import endpoints from './endpoints'
import userAgent from './userAgents'



class Instagram {
    async login(username: String, password: String, saveSession=false) {
        try {
            let response = await axios.get(endpoints.BASE_URL)

            let csrftoken = response.headers['set-cookie'].find((cookie: String) => cookie.match('csrftoken='))
                .split(';')[0].split('=')[1]           

                console.log(csrftoken)
            let mid = response.headers['set-cookie'].find((cookie: String) => cookie.match('mid='))
                .split(';')[0].split('=')[1]
                
            
            const headers = {
                'cookie': `ig_cb=1; csrftoken=${csrftoken}; mid=${mid};`,
                'referer': endpoints.BASE_URL + '/',
                'x-csrftoken': csrftoken,
                'X-CSRFToken': csrftoken,
                //'user-agent': userAgent.Instagram_155_in_Android_9_Samsung_SM_A102U
                'user-agent': userAgent.ChromeDesktop
            }

            const payload = `username=${username}&enc_password=${encodeURIComponent(`#PWD_INSTAGRAM_BROWSER:0:${Math.ceil((new Date().getTime() / 1000))}:${password}`)}`
            console.log(payload)
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
                console.log(response.data)
                console.log(response.headers)
                //{"3D64224D-5397-407E-9084-CF16C7D6C5E3","rur":"PRN","sessionid":"40017536730%3ApAfLjbLn5dNrpo%3A14","mid":"X4YaeQAEAAGtA9-_h64tX_WDna0D"}
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

                if(saveSession){
                    fs.writeFileSync(path.resolve(__dirname, `../sessions/${username}.json`), JSON.stringify(cookies))
                }

                return cookies
            }




        } catch (error) {
            throw error
        }
    }
}

export default Instagram



