export default async function(p){
  let res = await p.api.query([p.predicates.at("document.type", "story")], {
    graphQuery:`{
    story
    {
    uid
    photo
    title
    description
    }
    }`
  })
  return res
}
