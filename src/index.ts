import Instagram from './core/instagram'



(async () => {
    const instagram = new Instagram('amandasully.van', 'smile3030big')
    
    //await instagram.login('juliana_dardinha', 'esqueceucontato', true).catch(e => console.error(e))
    await instagram.login()
    await instagram.followByUsername('juliana_dardinha')

    //console.log(await instagram.getIdByUsername('rafael_rigoz'))
    
})()
