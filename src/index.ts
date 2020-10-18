import Instagram from './core/instagram'



(async () => {
    const instagram = new Instagram()
    
    await instagram.login('gabriel.levistiky', 'computadortop', true).catch(e => console.error(e))
    
})()
