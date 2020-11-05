import Instagram from './core/instagram'



(async () => {
    const instagram = new Instagram()
    
    //await instagram.login('juliana_dardinha', 'esqueceucontato', true).catch(e => console.error(e))
    await instagram.followByUsername('bestall.carlos')

    //console.log(await instagram.getIdByUsername('rafael_rigoz'))
    
})()
