$(document).ready(function() {

    let jsonBlogs;

    // Start de Ajax calls
    $.ajax({
        url: "blog.json",
        success: function(response){
            blogPost(response.blogs);
            blogClick();
            jsonBlogs = response.blogs;
        },
        
    });

    // Zorgt ervoor dat de pagina blog toevoegen wordt getoond
    document.getElementById("blogToevoegen").addEventListener("click", () => {

        let container = document.querySelector(".container");
        container.innerHTML = "";

        // Een form maken om een blog aan te maken
        const form = document.createElement("form");
        form.id = "blogForm";
        form.insertAdjacentHTML("afterbegin", 
        `  
        <div class="form-group">
            <label for="blogNaam">Naam van je blog</label>
            <input type="text" name="blogNaam" id="blogNaam" class="form-control form-control-lg mb-2">
            <label for="blogBeschrijving">Blog beschrijving</label>
            <textarea type="text" name="blogBeschrijving" id="blogBeschrijving" class="form-control form-control-lg"></textarea>
            </div>
        <div class="form-group">
            <label for="blogFoto">Kies je blog foto</label>
            <input type="file" name="blogFoto" id="blogFoto" class="form-control-file">
        </div>
        <button id="blogAanmaken" type="submit" class="mt-4">Blog aanmaken</button>
        `);

        // Het aangemaakte form in de container plaatsen
        container.insertAdjacentHTML("afterbegin", form.outerHTML);

        // Ervoor zorgen dat de menu item (blog toevoegen) actief wordt en het andere inactief (home)
        document.querySelector(".active").className = "nav-item";
        document.getElementById("blogToevoegen").parentElement.className = "nav-item active";

        blogAdd();

    });

    function blogHome(id, title, description, image, date){

        const container = document.querySelector(".container");

        // Een hoogtepunt template zodat het wordt getoond in de hoofdpagina
        const blog = document.createElement("div");
        blog.className = "blog-home";
        blog.insertAdjacentHTML("afterbegin",  
        `
        <h1 class="mb-4">The blog</h1>
        <div class="blog-card d-flex" id="blog_${id}">
            <div class="blog-img">
                <img src="${image}" alt="${title}" />
            </div>
            <div class="blog-details ml-4">
                <span class="blog-date">${date}</span>
                <h1 class="blog-title">${title}</h1>
                <p>${description}</p>
            </div>
        </div>
        `);

        // Het hoogtepunt blog aan de container toevoegen
        container.appendChild(blog);

    }

    function blogCard(row, id, title, description, image, date){

        // Een blog item aan maken zodat het wordt getoond in de hoofdpagina
        const card = document.createElement("div")
        card.className = "blog-card col-sm";
        card.id = `blog_${id}`
        card.insertAdjacentHTML("afterbegin",  
        `
        <h4 class="blog-title">${title}</h4>
        <div class="blog-img">
            <img src="${image}" alt="${title}" />
        </div>
        <div class="blog-details">
            <p class="mt-2">${description}</p>
            <span class="blog-date">${date}</span>
        </div>
        `);
        
        // Wanneer er 3 opeenvolgende blog items worden getoond dan zal er een niewe rij worden aangemaakt
        if (row){
            const newRow = document.createElement('div');
            newRow.className = "blog-row row mt-5";
            document.querySelector(".container").appendChild(newRow);

        }

        // plaats het blog item in het laatste aangemaakt rij
        const blogRow = document.querySelectorAll(".blog-row");
        blogRow[blogRow.length - 1].appendChild(card);

    }

    function blogPost(response){

        /*
            Functie ontvang een response van de AJAX call.
            Nadien gebruiken wij altijd het eerste blog item altijd als hoogtepunt via de eerste
            gekregen JSON ID van de response. Hier wordt de functie blogHome gebruikt.

            Elke andere ID van de reponse wordt standaard getoond in een item.
        */

        // Ervoor zorgen dat de menu item (home) actief wordt en het andere inactief (blog toevoegen)
        document.getElementById("home").parentElement.className = "nav-item active";
        document.getElementById("blogToevoegen").parentElement.className = "nav-item";

        let index = 0;
        let newRow = false;

        response.map((value) => {

            // Zorgt ervoor of er een nieuw rij kan worden aangemaakt
            index % 3 === 0 ? newRow = true : newRow = false;
            
            index++;
            
            // De eerste response ID wordt de hoogtepunt van het blog
            if (index === 1){
                
                blogHome(value.id, value.title, value.description, value.image, value.date);
                index = 3;
                
            } else {
                
                blogCard(newRow, value.id, value.title, value.description, value.image, value.date);
            }
            
        });

    }

    function blogClick(){

        let blogId;
        
        const blogItems = document.querySelectorAll(".blog-card");
        
        // Zorgt ervoor dat er via de juiste class het juiste blog ID wordt meegegeven
        blogItems.forEach(function(item){
            item.addEventListener("click", (e) => {
                
                const ids = e.path;
                
                for(i = 0; i < ids.length; i++){
                    
                    let html = ids[i].className;
                    
                    if(html === "blog-card col-sm"){
                        blogId = e.path[i].attributes[1].nodeValue;
                        
                    } else if (html === "blog-card d-flex"){
                        blogId = e.path[i].attributes[1].nodeValue;
                    }
                    
                    // Er is geen reden dat we alle HTML's doorlopen van elke klik
                    // Alleen HTML's tussen 0-4 kunnen een class hebben van "blog-card col-sm"
                    // of "blog-card d-flex" met daaraan de gekoppelde blog ID
                    if (i === 3){
                        break;
                    }
                }
                
                blogId = blogId.substr(5);
                blogDetail(blogId);
            })
        })
    }

    function blogDetail(id){

        const oldHtmlBlog = document.querySelector(".container").innerHTML;

        document.querySelector(".container").innerHTML = "";

        let blogId = id - 1;
        const blog = jsonBlogs[blogId];
        
        document.title = blog.title;
        
        // Een nieuwe detail pagina maken voor elke blog item
        const newHtmlBlog = document.querySelector(".container");
        newHtmlBlog.className = "container blog-detail";
        newHtmlBlog.insertAdjacentHTML("afterbegin",  
        `
        <button class="view-blogs widget">Terug naar blogs</button>
        <h1 class="blog-title mt-2">${blog.title}</h1>
        <div class="blog-img">
        <a href="${blog.image}" class="image-popup-no-margins" title="${blog.title}">
            <img src="${blog.image}" alt="${blog.title}"/>
        </a>
        </div>
        <div class="blog-details mt-2">
        <p class="mt-2">${blog.description}</p>
        <span class="blog-date">${blog.date}</span>
        </div>
        <a id="auteur" class="mt-5 mb-5 d-flex">Toon auteur</a>
        <span id="auteurInfo" style="display:none;">${blog.auteur}</span>
        `);
        
        // Wanneer er wordt geklikt op het vorige button
        // dan wordt eerst de huidige aangemaakt (detail pagina) leeggemaakt
        // en wordt de oude html pagina opnieuw geplaatst
        // De event listeners worden opnieuw gestart
        document.querySelector(".view-blogs").addEventListener("click", () => {
            document.querySelector(".container").innerHTML = "";
            document.querySelector(".container").insertAdjacentHTML("afterbegin",  oldHtmlBlog);
            blogClick();
            document.title = "Blog van Veton.";

        });

        // jQuery UI
        $(".widget").button();

        // jQuery plugin
        imagePopup();

        // jQuery animate
        $("#auteur").click(function (){
            $("#auteurInfo").fadeToggle("slow");
        });

    }

    function imagePopup(){

        $('.image-popup-no-margins').magnificPopup({
            type: 'image',
            closeOnContentClick: true,
            closeBtnInside: false,
            fixedContentPos: true,
            mainClass: 'mfp-no-margins mfp-with-zoom',
            image: {
                verticalFit: false
            },
            zoom: {
                enabled: true,
                duration: 300 // 
            }
        });
    }

    function blogAdd(){
        
        // Functie in jQuery
        // Formvalidatie van het blog toevoegen
        document.title = "Een nieuwe blog toevoegen";

        var FoutBlogNaam;
        var foutBlogBeschrijving;

        $("#home").click(function() {
            document.querySelector(".container").innerHTML = "";
            blogPost(jsonBlogs);
            blogClick();
            document.title = "Blog van Veton.";
        });

        $("#blogForm").submit(function(e) {
            const blogNaam = $("#blogNaam").val();
            const blogBeschrijving = $("#blogBeschrijving").val();

            if (blogNaam.length <= 4){

                if (!FoutBlogNaam){
                    
                    FoutBlogNaam = true;
                    var foutHtml = $('<span id="errorBlogNaam" class="error d-flex mb-1"></span>');
                    foutHtml.text("Je titel  minimaal bestaan uit 5 tekens");
                    $("#blogNaam").after(foutHtml);

                }
                
            } else if (blogNaam.length >= 5 && FoutBlogNaam){

                if(blogNaam){
                    $("#errorBlogNaam").remove();
                    FoutBlogNaam = null;
                }
            }
            
            if(blogBeschrijving.length <= 19){

                if (!foutBlogBeschrijving){

                    foutBlogBeschrijving = true;
                    var foutHtml = $('<span id="errorblogBeschrijving" class="error d-flex mb-1"></span>');
                    foutHtml.text("Het beschrijving moet bestaan uit minimaal 20 tekens");
                    $("#blogBeschrijving").after(foutHtml);

                }

            } else if (blogBeschrijving.length >= 19 && foutBlogBeschrijving){
                $("#errorblogBeschrijving").remove();
                foutBlogBeschrijving = null;
            }


            if (FoutBlogNaam !== true && foutBlogBeschrijving !== true){
                $("#blogForm").remove();
                const success = $('<span class="success">Nieuwe blog aangemaakt</span>');
                $(".container").append(success);
            }

            e.preventDefault();
        });

    }

});