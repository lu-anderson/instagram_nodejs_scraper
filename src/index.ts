import Instagram from './core/instagram'



(async () => {
    try {
        const instagram = new Instagram('jessicasantos5254', 'G@ai45lk')
        await instagram.setProxy(
            'zproxy.lum-superproxy.io',
            '22225',
            'lum-customer-hl_88429293-zone-brasil2-ip-45.130.213.233',
            'j1or7h42ri1i'

        )
        await instagram.login()
        await instagram.followByUsername('sadsolitaryy')

    } catch (error) {
        console.log(error.message)
    }
})()
