// http.js
import keywords from "./keywords";

export default {
    port: 3000,
    fetch(request: Request) {
      const query = request.url.split('?')[1];

      if (keywords[query]) {
        console.log(`redirecting to ${keywords[query]}`)
        return new Response("", {
          status: 302,
          headers: {
            Location: keywords[request.url.split('?')[1]]
          }
        });
      } else {
        console.log(`no match for ${query}`);
        return new Response(`
        <html>Not found :(</html>`)
      }

    },
  };