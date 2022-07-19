type addBody = {
  shortcut: string
  url: string
}

export default {
    port: 80,
    async fetch(request: Request) {
      const query = request.url.split('?')[1];
      let keywords = await Bun.file('./keywords.json').json()

      if (query === undefined) {
        if (/add/.test(request.url)) {
          const json: addBody = await request.json()
          keywords[json.shortcut] = json.url
          await updateKeywordsFile(keywords)
          return new Response("", { status: 201})
        } else if (/createPage/.test(request.url)) {
          const createPage = Bun.file('./public/createPage.html')
          return new Response(createPage)
        } else if (/data/.test(request.url)) {
          return new Response(Bun.file('./keywords.json'), {headers: {'Content-Type': 'application/json'}})
        } else if (/list/.test(request.url)) {
          const listPage = Bun.file('./public/list.html')
          return new Response(listPage)
        }
      } else {
      if (/favicon/.test(request.url)) {
        return new Response("", {status: 404})
      } else if (/notfound/.test(request.url)) {
        const notFoundPage = Bun.file('./public/index.html')
        return new Response(notFoundPage)
      } else if (keywords[query]) {
        return new Response("", {
          status: 302,
          headers: {
            Location: keywords[request.url.split('?')[1]]
          }
        });
      } else {
        return new Response("", {
          status: 302,
          headers: {
            Location: request.url.split('?')[0]+ "notfound?" + request.url.split('?')[1]
          }
        })
      }
    }

    },
  };

async function updateKeywordsFile(newMapping) {
  await Bun.write(Bun.file('keywords.json'), JSON.stringify(newMapping))
}