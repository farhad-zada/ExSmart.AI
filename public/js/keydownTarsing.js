document
  .getElementById("tarsing")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const planeIcon = document.querySelector(".fa-paper-plane");
      const userInput = document.querySelector("textarea").value;
      const ul = document.querySelector("ul");
      const liUserInput = document.createElement("li");
      liUserInput.classList.add("user");

      liUserInput.innerHTML = `
      <div class="userText">
       <p>${userInput}</p>
       <div
        <span>You ✨</span>
       </div> 
      </div>
        `;

      ul.appendChild(liUserInput);

      const liLoadingIndicator = document.createElement("li");
      liLoadingIndicator.innerHTML = `<p class="loading">Typing... 🕊️</p>`;
      ul.appendChild(liLoadingIndicator);

      ul.scrollTop = ul.scrollHeight;

      const url = "/";
      // const url = "http://127.0.0.1:80/";

      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Handle the response from the server if needed
          console.log(data);
          ul.removeChild(liLoadingIndicator);
          const liAssistan = document.createElement("li");
          liAssistan.classList.add("asistan");
          const liAssistanText = document.createElement("div");
          liAssistanText.classList.add("asistanText");
          liAssistan.append(liAssistanText);

          let responseHTML = ``;
          if (!data) {
            throw Error("No response found from server!");
          }

          if (data.content) {
            console.log(data.content);
            responseHTML = `<p>${data.content}</p>`;
          }
          if (data.function_call !== undefined) {
            responseHTML += processFunctionCallCreateRoadmap(
              data.function_call
            );
          }

          liAssistanText.innerHTML =
            responseHTML + `<div><span>Tars 🤓</span></div>`;

          ul.appendChild(liAssistan);
        })
        .catch((error) => {
          const liError = document.createElement("li");
          liError.innerHTML = `<p>Something went wrong 🥺</p>
        <span>error 🤯</span>`;
          ul.appendChild(liError);
          console.error(error);
        });
      document.querySelector('textarea[name="question"]').value = "";
    }
  });

function processFunctionCallCreateRoadmap(functionCall) {
  const args = functionCall.arguments;
  console.log(args);
  return args.steps
    .map((step) => {
      return (
        `<strong>${step.step_number}. ${step.step_title}</strong>
    <br></br>
    <p>${step.step_description}</p>
    <br></br><div class="iframe-container">` +
        step.youtube_embedding
          .map(
            (embd) =>
              `<div class="iframe-box"><iframe width="200" height="100" src="${embd}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>`
          )
          .join("") +
        "</div>"
      );
    })
    .join("<br></br><br></br>");
}
