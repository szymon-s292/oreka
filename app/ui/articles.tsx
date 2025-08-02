

export default async function ArticlesList({editable}: {editable?: boolean}) {
 
  
  return (
    <>
      <div>
      {articles.map((a, i) => {
       return (
        <div key={i} className="mt-16 pb-8 border-b border-gray-400">
          <div className="flex justify-between">
            <p className="text-4xl mb-4 font-bold text-black">{a.title}</p>
            <div>
              <p>Autor: {a.author}</p>
            </div>
          </div>
          <p>{a.content}</p>
        </div>
        )
      })}
      </div>
    </>
  )
} 