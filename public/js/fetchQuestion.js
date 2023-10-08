document
  .getElementById("tarsing")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const userInput = document.querySelector(
        'textarea[name="question"]'
      ).value;
      const ul = document.querySelector("ul");
      const liUserInput = document.createElement("li");

      liUserInput.innerHTML = `
        <p>${userInput}</p>
        <span>user</span>
        `;
      ul.appendChild(liUserInput);

      const liLoadingIndicator = document.createElement("li");
      liLoadingIndicator.innerHTML = "Typing... 🕊️";
      ul.appendChild(liLoadingIndicator);

      ul.scrollTop = ul.scrollHeight;

      // TODO:
      fetch("http://159.89.109.212:3000/", {
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

          let responseHTML = ``;
          if (!data) {
            throw Error("No response found from server!");
          }

          if (data.message) {
            responseHTML = `<p>${data.message.content}</p>
            <span>${data.message.role}</span>`;
          }
          if (data.function_call !== undefined) {
            responseHTML += processFunctionCallCreateRoadmap(
              data.function_call
            );
          }

          liAssistan.innerHTML = responseHTML;

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
  const arguments = functionCall.arguments;
  console.log(arguments);
  return arguments.steps
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
