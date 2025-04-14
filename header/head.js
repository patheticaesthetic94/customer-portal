
//Define the root service URLs where code will be injected
const ideagenHelp = "help.ideagen.com";
const ideagenCommunity = "community.ideagen.com";
const ideagenHelpSandbox = "ideagen1559902641.zendesk.com";
const ideagenCommunitySandbox = "ideagen-en-community.almostinsided.com";
const currentPlatform = [];

//Define areas of the nav-bar
const itemsSearch = ".unified-navigation--items-and-search";
const navItems = 'nav[role="navigation"]';
const itemsMenu = ".unified-navigation--items-menu";
const mainMenu = ".unified-navigation--main-menu";
const subMenu = ".unified-navigation--sub-menu";
const editionsMenu = ".unified-navigation--editions-menu";
const sliderMenu = ".unified-navigation--slider-navigation";
const searchButton = ".unified-navigation--search";
const searchBar = ".unified-navigation--search-bar";
const ctaProfile = ".unified-navigation--cta-buttons";

function clickedSearchButton() {
  $(itemsSearch + " " + searchBar)
      .not(".mobile")
      .css("display", "block"),
      setTimeout(function () {
          $(itemsSearch + " " + searchBar + ' input[type="search"]').focus();
      }, 50),
      $(searchButton).hide(),
      $(navItems).hide(),
      $(searchBar + " .is-visible-S").show(),
      $(document).mouseup(function (e) {
          var n = "";
          currentPlatform.indexOf("community") > -1 ? (n = $(itemsSearch + " " + searchBar + " .search-box")) : currentPlatform.indexOf("help") > -1 && (n = $(itemsSearch + " " + searchBar)),
              n.is(e.target) || 0 !== n.has(e.target).length || ($(searchBar).not(".mobile").hide(), $(window).width() < 1024 ? $(navItems).hide() : $(navItems).show(), $(searchButton).show());
      });
    }

function closeMobileNav() {
  $(".unified-navigation--slider-content").removeClass('open');
  $(".unified-navigation--slider-content").addClass('close');
  setTimeout(
    function () {
      $(".unified-navigation--slider-content").hide();
      $(".unified-navigation--slider-content").removeClass('close');
    }, 400);
  $(".unified-navigation--slider-shade").fadeOut('fast');
  $("body").css("overflow", "initial");
}

$(document).ready(function () {
  //Runs platform specific code on Ideagen Help
  if (
    window.location.href.indexOf(ideagenHelp) > -1 ||
    window.location.href.indexOf(ideagenHelpSandbox) > -1
  ) {
    currentPlatform.push("help");
    $('[platform="community"]').remove(); //Removes any Ideagen Community related code

    // Check if the div with class '.home__page' and id '#main' exists
    if ($('.home__page#main').length > 0 || $('.support-portal__page#main').length > 0) {
      // Hide the element with class '.unified-navigation--cta-buttons' and id '#login-button'
      $('.unified-navigation--cta-buttons [data-auth-action="signin"]').hide();
    }

    // Hides 'get support' button on support pages
    if (window.location.href.indexOf('/p/support') > -1 || window.location.href.indexOf('/requests') > -1) {
      // Hide the element with class '.unified-navigation--btn-secondary' and id '#support-button'
      $('.unified-navigation--cta-buttons #support-button').hide();
    }

    //Hides the tooltip on the login button if the user is already logged in or on mobile
    if (!$(ctaProfile + " #user").length) {
      if ($(window).width() > 1024) {
        $(ctaProfile + " #login-button").on({
          mouseenter: function () {
            $(ctaProfile + " #support-login-message").show();
          },
          mouseleave: function () {
            $(ctaProfile + " #support-login-message").hide();
          },
        });
      }
    }
    //Adds a blue highlight around the user profile icon while the drop-down is active
    $(ctaProfile + " .user-info.dropdown .user-avatar").click(function (e) {
      e.stopPropagation(); // Prevents the click from propagating to the document
      $(ctaProfile + " .user-info.dropdown .dropdown-menu").toggle(); // Toggles the visibility of the dropdown menu
      $(ctaProfile + " .user-info.dropdown .user-avatar").css({
        outline: "2px solid #5cc7d0",
        transition: "0.2s",
      });
    });

    // Hide the dropdown and remove outline when clicking anywhere else
    $(document).click(function (e) {
      var container = $(ctaProfile + " .user-info.dropdown");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        $(ctaProfile + " .user-info.dropdown .dropdown-menu").hide();
        $(ctaProfile + " .user-info.dropdown .user-avatar").css({
          outline: "2px solid transparent",
          transition: "0.2s",
        });
      }
    });


    // Shows and hides the nav-bar seach bar
    $(itemsSearch + " " + searchButton).click(function () {
      clickedSearchButton();
    });
  }

  //Runs specific code on Ideagen Community
  else if (
    window.location.href.indexOf(ideagenCommunity) > -1 ||
    window.location.href.indexOf(ideagenCommunitySandbox) > -1
  ) {
    currentPlatform.push("community");
    $('[platform="help"]').remove(); //Removes any Ideagen Help related code
    $(".header-navigation .main-navigation--nav-buttons-wrapper")
      .detach()
      .appendTo(ctaProfile + '[platform="community"]'); //Moves CTA & profile area to unified nav
      $(".header-navigation .header-navigation_extendable-search.extended").detach().appendTo(".main-navigation--search-wrapper"),
      "roles.guest" === inSidedData.user.role &&
          ($(ctaProfile + " .qa-header-login-button")
              .removeClass("btn--secondary")
              .addClass("btn--cta"),
          $(ctaProfile + " .qa-menu-create-topic")
              .removeClass("btn--cta")
              .addClass("btn--secondary")),
      0 === $(".header-navigation_extended-search").length && ($(searchButton).remove(), $(searchBar + ".mobile").remove()),
      $(".main-navigation--wrapper.header-navigation").remove(),
      $(".unified-navigation--search").click(function () {
          clickedSearchButton();
      }),
      $(".ecosystem_landing_page").length > 0 && ($(".unified-navigation--cta-buttons").hide(), $(".unified-navigation--search-bar").hide(), $(".unified-navigation--search").hide(), $(".btn--fixed__bottom").hide());
  var e = $(".unified-navigation--search-bar:not(.mobile)").children();
  function n() {
      $(window).width() < 767
          ? $(".unified-navigation--search-bar.mobile").children().length || e.detach().appendTo(".unified-navigation--search-bar.mobile")
          : $(".unified-navigation--search-bar:not(.mobile)").children().length || $(".unified-navigation--search-bar.mobile").children().detach().appendTo(".unified-navigation--search-bar:not(.mobile)");
  }
  n(),
      $(window).resize(function () {
          n();
      });
} else {
    currentPlatform.push("generic");
    $('[platform="help"], [platform="community"]').remove(); //Removes code relating to platforms if not on a platform
  }

  //Navigation code

  //Gets current page URL and compares it with defined URLs for products to show correct resources menu
  let currentSolution = null;
  const currentURL = window.location.href.toString();

  //Changes the locations of drop-downs based on if there's a resources menu present
  if ($('[type="resources"]').is(":visible")) {
    var communityCalc = parseFloat($("#community-drop-down").css("left"));
    var communitySpeechCalc =
      parseFloat($("#community-drop-down .speech-indicator").css("left")) +
      "px";
    var helpSpeechCalc =
      parseFloat($("#help-drop-down .speech-indicator").css("left")) + "px";
    var helpCalc = parseFloat($("#help-drop-down").css("left"));
    var resourcesCalc = $('[type="resources"]').width() + "px";
    $("#community-drop-down .speech-indicator").css(
      "left",
      "calc(" + communitySpeechCalc + " + " + resourcesCalc + " + 42px)"
    );
    $("#help-drop-down .speech-indicator").css(
      "left",
      "calc(" + helpSpeechCalc + " + " + resourcesCalc + " + 42px)"
    );
    $('[type="resources"] .speech-indicator').css(
      "left",
      "calc(" + resourcesCalc + " / 2 + 12px)"
    );
    var dropdownStart = $('[type="resources"]').width() - communityCalc + 42;
    var helpdropdownStart = $('[type="resources"]').width() - helpCalc + 42;
    var dropdownCalc = "-" + dropdownStart + "px";
    var helpdropdownCalc = "-" + helpdropdownStart + "px";
    $("#community-drop-down").css("left", dropdownCalc);
    $("#help-drop-down").css("left", helpdropdownCalc);
  }

  //Gets the clicked drop-down value and opens the correct menu
  $(navItems + " " + itemsMenu + " li").click(function () {
    let selectedDropdown = $(this).attr("dropdown");
    $("#" + selectedDropdown + "-drop-down").css('display', 'inline-flex');
    $(document).mouseup(function (e) {
      // Closes drop-down menu if clicked away
      var container = $("#" + selectedDropdown + "-drop-down");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        container.hide();
      }
    });

    // // Gets the height of the open drop-down and adjusts the separator line height
    // var communityHeight = $(".unified-navigation--drop-down").height();
    // var communityHeightCalc = communityHeight - 93;
    // $(editionsMenu).css("height", communityHeightCalc + "px");

    // Keeps the first column option highlighted even when not hovering over an option
    $("#" + selectedDropdown + "-drop-down " + mainMenu + " li").each(
      function () {
        $(this).on("mouseover", function () {
          $(
            "#" +
            selectedDropdown +
            "-drop-down " +
            mainMenu +
            " li, #" +
            selectedDropdown +
            "-drop-down" +
            " " +
            subMenu +
            " li"
          ).removeClass("selected");
          $(
            "#" +
            selectedDropdown +
            "-drop-down " +
            subMenu +
            ", #" +
            selectedDropdown +
            "-drop-down" +
            " " +
            editionsMenu +
            ", #" +
            selectedDropdown +
            "-drop-down .menu-separator#editions-menu"
          ).hide();
          $(this).addClass("selected");
          let getID = $(this).attr("id");
          $("#" + selectedDropdown + "-drop-down " + subMenu + "#" + getID).css(
            "display",
            "inline-block"
          );
        });
      }
    );

    // Keeps the second column option highlighted even when not hovering over an option
    $(
      "#" + selectedDropdown + "-drop-down .unified-navigation--sub-menu li"
    ).each(function () {
      $(this).on("mouseover", function () {
        $("#" + selectedDropdown + "-drop-down " + subMenu + " li").removeClass(
          "selected"
        );
        $(
          "#" +
          selectedDropdown +
          "-drop-down " +
          editionsMenu +
          ", #" +
          selectedDropdown +
          "-drop-down .menu-separator#editions-menu"
        ).hide();
        if ($(this).is("[has-more]")) {
          $(this).addClass("selected");
        }
        var getID = $(this).attr("id");
        $(
          "#" + selectedDropdown + "-drop-down " + editionsMenu + "#" + getID
        ).css("display", "inline-block");
        var editionsMenuOpen = $(
          "#" + selectedDropdown + "-drop-down " + editionsMenu + "#" + getID
        ).css("display", "inline-block");
        if (editionsMenuOpen.css("display") == "inline-block") {
          $(
            "#" + selectedDropdown + "-drop-down .menu-separator#editions-menu"
          ).css("display", "inline-block");
        } else {
          $(
            "#" + selectedDropdown + "-drop-down .menu-separator#editions-menu"
          ).hide();
        }
      });
    });
  });


  //Mobile navigation code
  $(itemsMenu).clone().appendTo(sliderMenu); //Copies the entire navigation inside the slider

  //Open the slider on tap of the burger menu
  $(".unified-navigation--slider-trigger").click(function () {
    $("body").css("overflow", "hidden");
    $(
      sliderMenu + " " + subMenu + ", " + sliderMenu + subMenu + " li span"
    ).removeAttr("style"); //Removes any desktop styling
    $(".unified-navigation--slider-shade").fadeIn();
    $(".unified-navigation--slider-content").addClass('open');
    $(".unified-navigation--slider-content").show();

    $(document).mouseup(function (e) {
      //Hides the slider menu if tapped away
      var container = $(".unified-navigation--slider-shade");
      if (container.is(e.target) && container.has(e.target).length === 0) {
        closeMobileNav();
      }
    });
    $("#mobile-close").click(function () {
      //Hides the slider menu if the X is tapped
      closeMobileNav();
    });

    //Controls the back button in the mobile menu
    $(sliderMenu + " .back-button").click(function () {
      if ($(this).is("#main-menu")) {
        $(sliderMenu + " .unified-navigation--expandable-dropdown span").show();
        $(sliderMenu + " " + itemsMenu).attr("style", "display: flex");
        $(
          sliderMenu +
          " " +
          mainMenu +
          ", " +
          sliderMenu +
          " " +
          " .back-button#main-menu"
        ).hide();
      } else if ($(this).is("#sub-menu")) {
        $(
          sliderMenu +
          " " +
          subMenu +
          ", " +
          sliderMenu +
          " " +
          " .back-button#sub-menu"
        ).hide();
        $(
          sliderMenu +
          " " +
          mainMenu +
          " .unified-navigation--horizontal-line, " +
          sliderMenu +
          " " +
          " .back-button#main-menu, " +
          sliderMenu +
          " " +
          mainMenu +
          " li"
        ).show();
      } else if ($(this).is("#editions-menu")) {
        $(
          sliderMenu +
          " " +
          editionsMenu +
          ", " +
          sliderMenu +
          " " +
          " .back-button#editions-menu"
        ).hide();
        $(
          sliderMenu +
          " " +
          " .back-button#sub-menu, " +
          sliderMenu +
          " " +
          subMenu +
          " li"
        ).show();
      }
    });

    //Gets the clicked drop-down value and opens the correct menu
    //Items menu to main menu options
    $(sliderMenu + " " + itemsMenu + " .service-name").click(function () {
      let selectedDropdown = $(this).attr("dropdown");
      $(sliderMenu + " " + itemsMenu + " li span")
        .not("#has-more")
        .hide();
      $(sliderMenu + " " + itemsMenu).css("display", "block");
      $(sliderMenu + " " + itemsMenu + " li").removeClass("selected");
      $(
        sliderMenu +
        " " +
        itemsMenu +
        " #community-main-back, " +
        sliderMenu +
        " #" +
        selectedDropdown +
        "-main, " +
        sliderMenu +
        " .back-button#main-menu"
      ).show();
      //Main menu to sub menu options
      $(sliderMenu + " " + mainMenu + " li").click(function () {
        let selectedMainDropdown = $(this).attr("id");
        $(
          sliderMenu +
          " " +
          mainMenu +
          " li, " +
          sliderMenu +
          " .back-button#main-menu, " +
          sliderMenu +
          " " +
          mainMenu +
          " .unified-navigation--horizontal-line"
        ).hide();
        $(
          sliderMenu +
          " .back-button#sub-menu, " +
          sliderMenu +
          " .unified-navigation--sub-menu#" +
          selectedMainDropdown
        ).show();
        $(
          sliderMenu +
          " .unified-navigation--sub-menu span"
        ).show();
      });
      //Sub menu to editions menu options
      $(sliderMenu + " " + subMenu + " li[has-more]").click(function () {
        let selectedSubDropdown = $(this).attr("id");
        $(
          sliderMenu +
          " " +
          subMenu +
          " li, " +
          sliderMenu +
          " .back-button#sub-menu"
        ).hide();
        $(
          sliderMenu +
          " .back-button#editions-menu, " +
          sliderMenu +
          " .unified-navigation--editions-menu#" +
          selectedSubDropdown
        ).show();
      });
    });
  });
});

$(document).ready(function() {
  let articlesLoaded = {}; // Object to track if articles have been loaded
  let currentArticleId = null; // Variable to store the current displayed article ID
  let articlesFetched = false; // Flag to prevent duplicate API calls

  // Function to convert date to relative time
  function timeAgo(date) {
      const now = new Date();
      const diffInSeconds = Math.floor((now - new Date(date)) / 1000);
      const intervals = {
          year: 31536000,
          month: 2592000,
          week: 604800,
          day: 86400,
          hour: 3600,
          minute: 60,
          second: 1,
      };

      for (const interval in intervals) {
          const time = Math.floor(diffInSeconds / intervals[interval]);
          if (time > 1) return `${time} ${interval}s ago`;
          if (time === 1) return `1 ${interval} ago`;
      }

      return 'just now';
  }

  // Function to extract the first 40 words from the article body, excluding blockquote elements
  function extractBodyContent(htmlContent) {
      const tempDiv = $('<div>').html(htmlContent);
      tempDiv.find('blockquote').remove();
      const textContent = tempDiv.text();
      const words = textContent.trim().split(/\s+/);
      return words.length > 13 ? words.slice(0, 13).join(' ') + '...' : words.join(' ');
  }

  // Function to generate article buttons from the section
  function loadArticlesFromSection() {
      if (articlesFetched) return; // Prevent multiple API calls

      const sectionId = '21416185714834'; // Section ID
      const url = `https://help.ideagen.com/api/v2/help_center/sections/${sectionId}/articles.json`;

      $.ajax({
          url: url,
          method: 'GET',
          dataType: 'json',
          success: function(response) {
              articlesFetched = true; // Mark articles as fetched to avoid future calls

              const articles = response.articles;
              const buttonsContainer = $('#latest-changes .pull-out-buttons');
              buttonsContainer.empty(); // Clear existing buttons

              // Sort articles by created date (newest first)
              articles.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

              // Limit the number of articles to display (including the most recent one)
              const articlesToDisplay = articles.slice(0, 2); // Get the top 3 articles

              // Loop through each article and create a button
              articlesToDisplay.forEach((article, index) => {
                  let additionalClass = 'large-full-width';
                  let relativeDate = timeAgo(article.created_at);

                  // Generate button HTML with bodyContent
                  const buttonHtml = `
                    <div class="pull-out-button ${additionalClass}" load-help-article="${article.id}">
                      <div style="flex: 1;display: flex;flex-direction: column;">
                        <span data-type="title">${article.title}</span>
                        <span data-type="date">Posted ${relativeDate}</span>
                        <span data-type="body">${extractBodyContent(article.body)}</span>
                      </div>
                    </div>
                  `;

                  // Append button to the container
                  buttonsContainer.append(buttonHtml);
              });

              // Re-bind click events to dynamically created buttons
              bindArticleButtons();
          },
          error: function(xhr, status, error) {
              console.error('Error fetching section articles:', error);
          }
      });
  }

  // Function to bind the click event to pull-out buttons
  function bindArticleButtons() {
      $('.pull-out-button').on('click', function() {
          const articleId = $(this).attr('load-help-article'); // Get the article ID from the clicked button
          const url = `https://help.ideagen.com/api/v2/help_center/articles/${articleId}.json`;

          // Hide the main content and show the article section
          $('.pull-out-main').hide();
          $('#article-content').show();
          $('#back-to-main').show(); // Show the back button when article is loaded

          // Check if the article ID is different from the current one displayed
          if (currentArticleId !== articleId) {
              currentArticleId = articleId; // Update the current article ID

              if (!articlesLoaded[articleId]) {
                  // Load the article content via API only if not already loaded
                  $.ajax({
                      url: url,
                      method: 'GET',
                      dataType: 'json',
                      success: function(response) {
                          const articleTitle = response.article.title; // Extract article title
                          const articleBody = response.article.body;   // Extract article body

                          // Insert the article title and body into the respective divs
                          $('#article-content-title').html(articleTitle); // Insert the article title
                          $('#article-content-body').html(articleBody);   // Insert the article content into the div

                          articlesLoaded[articleId] = { title: articleTitle, body: articleBody }; // Cache the loaded article
                      },
                      error: function(xhr, status, error) {
                          console.error('Error fetching article:', error);
                          $('#article-content-body').html('<p>Sorry, the article could not be loaded.</p>');
                      }
                  });
              } else {
                  // If the article is already loaded, retrieve it from the cache
                  const cachedArticle = articlesLoaded[articleId];
                  $('#article-content-title').html(cachedArticle.title);  // Retrieve cached title
                  $('#article-content-body').html(cachedArticle.body);    // Retrieve cached body
              }
          }
      });
  }

  // Load articles from the section on page load
  loadArticlesFromSection();

  $('#trigger-pullout').on('click', function() {
      // Add the lock-scroll class
      $('body').css('overflow', 'hidden');

      $('.lightbox-bg').fadeIn(200);
      $('.pull-out_right').addClass('visible');
      $('.pull-out-main').show();
      $('#article-content').hide();
      $('#back-to-main').hide();

      loadArticlesFromSection(); // Load articles on trigger, but only if not already fetched
  });

  $('#back-to-main').on('click', function() {
      $('#article-content').hide();
      $('.pull-out-main').show();
      $('#back-to-main').hide();
      currentArticleId = null;
  });

  $('.close-button').on('click', function() {
      closeLightbox();
  });

  $(document).on('click', function(event) {
      if (!$(event.target).closest('.pull-out_right, #trigger-pullout').length) {
          closeLightbox();
      }
  });

  function closeLightbox() {
      $('.pull-out_right').removeClass('visible');
      setTimeout(function() {
          $('.lightbox-bg').fadeOut(200);
          $('.pull-out-main').show();
          $('#article-content').hide();
          $('#back-to-main').hide();
          currentArticleId = null;

          // Remove overflow hidden via inline CSS
          $('body').css('overflow', '');
      }, 200);
  }
});

document.addEventListener("DOMContentLoaded", function() {
    // DOM Elements
    const solutionMetadataDiv = document.querySelector(".col.solution-metadata");
    const productDirectoryDiv = document.querySelector(".product-directory");
    const productSwitch = document.querySelector(".product-switch");
    const productSwitchChev = document.querySelector(".product-switch svg");
    const currentUrl = window.location.href;

    // Check if we're on a dashboard page and get solution parameter
    function getDashboardSolutionId() {
        const urlObj = new URL(currentUrl);
        if (urlObj.pathname.includes("/p/dashboard") && urlObj.searchParams.has("solution")) {
            return urlObj.searchParams.get("solution");
        }
        return null;
    }

    // Check community conditions and get category ID
    function getCommunityCategoryId() {
        if (!currentUrl.includes("ideagen-en-community.almostinsided.com")) {
            return null;
        }

        if (!window.inSidedData || !window.inSidedData.content || !window.inSidedData.content.category) {
            return null;
        }

        return window.inSidedData.content.category.id;
    }

    // Check events page conditions and get solution parameter
    function getEventsSolutionId() {
        const urlObj = new URL(currentUrl);
        if (currentUrl.includes("ideagen-en-community.almostinsided.com") && 
            currentUrl.includes("/events") && 
            urlObj.searchParams.has("solution")) {
            return urlObj.searchParams.get("solution");
        }
        return null;
    }

    // Check Zendesk conditions and get subdomain
    function getZendeskSubdomain() {
        try {
            const urlObj = new URL(currentUrl);
            if (urlObj.hostname.endsWith("zendesk.com") && 
                urlObj.hostname.split('.').length > 2) {
                // Extract subdomain (e.g., "iqm" from "iqm.zendesk.com")
                return urlObj.hostname.split('.')[0];
            }
        } catch (e) {
            console.error("Error parsing URL:", e);
        }
        return null;
    }

    // Check if current URL is a support section
    function isSupportSection() {
        const supportPaths = [
            "/p/support",
            "/p/skills",
            "/requests/new",
            "/requests",
            "/request",
            "/p/cs-contact"
        ];
        return supportPaths.some(path => currentUrl.includes(path));
    }

    // Find matching product based on new criteria
    function findMatch(data) {
        const solutionId = getDashboardSolutionId();
        const categoryId = getCommunityCategoryId();
        const eventsSolutionId = getEventsSolutionId();
        const zendeskSubdomain = getZendeskSubdomain();

        // Search through all products to find a match
        const products = findAllProducts(data);
        
        if (solutionId) {
            // Look for dashboard match
            const dashboardMatch = products.find(product => 
                product.match.id && product.match.id.home === solutionId
            );
            if (dashboardMatch) return dashboardMatch;
        }
        
        if (categoryId) {
            // Look for community match
            const communityMatch = products.find(product => 
                product.match.community_id && 
                product.match.community_id.includes(categoryId)
            );
            if (communityMatch) return communityMatch;
        }
        
        if (eventsSolutionId) {
            // Look for events page match
            const eventsMatch = products.find(product => 
                product.match.id && product.match.id.home === eventsSolutionId
            );
            if (eventsMatch) return eventsMatch;
        }
        
        if (zendeskSubdomain) {
            // Look for Zendesk subdomain match
            const zendeskMatch = products.find(product => 
                product.match.id && product.match.id.help === zendeskSubdomain
            );
            if (zendeskMatch) return zendeskMatch;
        }

        return null;
    }

    // Update sub-nav visibility and active pills
    function updateSubNavVisibility(data) {
        const subNav = document.querySelector(".sub-nav");
        const dashboardPill = document.querySelector(".content-switch-pill#dashboard");
        const communityPill = document.querySelector(".content-switch-pill#community");
        const eventsPill = document.querySelector(".content-switch-pill#events");
        const helpPill = document.querySelector(".content-switch-pill#help");
        const supportPill = document.querySelector(".content-switch-pill#support");
        
        const solutionId = getDashboardSolutionId();
        const categoryId = getCommunityCategoryId();
        const eventsSolutionId = getEventsSolutionId();
        const zendeskSubdomain = getZendeskSubdomain();
        const isSupport = isSupportSection();
        
        const isDashboardActive = solutionId !== null;
        let isCommunityActive = false;
        let isEventsActive = false;
        let isZendeskActive = false;
        let isHelpActive = false;
        let isSupportActive = false;
        
        if (categoryId !== null && data) {
            const products = findAllProducts(data);
            isCommunityActive = products.some(product => 
                product.match.community_id && 
                product.match.community_id.includes(categoryId)
            );
        }
        
        if (eventsSolutionId !== null && data) {
            const products = findAllProducts(data);
            isEventsActive = products.some(product => 
                product.match.id && 
                product.match.id.home === eventsSolutionId
            );
        }
        
        if (zendeskSubdomain !== null && data) {
            const products = findAllProducts(data);
            isZendeskActive = products.some(product => 
                product.match.id && 
                product.match.id.help === zendeskSubdomain
            );
            
            // Determine which pill should be active for Zendesk
            if (isZendeskActive) {
                if (isSupport) {
                    isSupportActive = true;
                } else {
                    isHelpActive = true;
                }
            }
        }
        
        const shouldShowSubNav = isDashboardActive || isCommunityActive || isEventsActive || isZendeskActive;
        
        if (subNav) {
            subNav.style.display = shouldShowSubNav ? "flex" : "none";
        }
        
        if (dashboardPill) {
            dashboardPill.classList.toggle("active", isDashboardActive);
        }
        
        if (communityPill) {
            communityPill.classList.toggle("active", isCommunityActive);
        }
        
        if (eventsPill) {
            eventsPill.classList.toggle("active", isEventsActive);
        }
        
        if (helpPill) {
            helpPill.classList.toggle("active", isHelpActive);
        }
        
        if (supportPill) {
            supportPill.classList.toggle("active", isSupportActive);
        }
    }

    // Initialize visibility (will be updated after JSON loads)
    updateSubNavVisibility();

    // Variables for mobile switch functionality
    let mobileMenuCreated = false;
    let mobileMenuContainer = null;
    let originalPills = [];

    // Initialize product directory as hidden
    if (productDirectoryDiv) {
        productDirectoryDiv.style.display = "none";
    }

    // Toggle product directory visibility
    if (productSwitch && productDirectoryDiv && productSwitchChev) {
        productSwitch.addEventListener("click", function(e) {
            e.stopPropagation();
            const isOpening = productDirectoryDiv.style.display !== "flex";
            
            productDirectoryDiv.style.display = isOpening ? "flex" : "none";
            
            if (isOpening) {
                productSwitch.classList.add("open");
                productSwitchChev.classList.add("rotate");
            } else {
                productSwitch.classList.remove("open");
                productSwitchChev.classList.remove("rotate");
            }
        });

        document.addEventListener("click", function() {
            productDirectoryDiv.style.display = "none";
            productSwitch.classList.remove("open");
            productSwitchChev.classList.remove("rotate");
        });

        productDirectoryDiv.addEventListener("click", function(e) {
            e.stopPropagation();
        });
    }

    // Fetch and process product data
    fetch("https://patheticaesthetic94.github.io/customer-portal/product-directory.json")
        .then(response => response.json())
        .then(data => {
            // Find the current match using new logic
            const result = findMatch(data);
            
            // Populate product directory (excluding current match)
            if (productDirectoryDiv) {
                populateProductDirectory(data, productDirectoryDiv, result ? result.match : null);
            }

            // Handle current page's solution metadata if matched
            if (result) {
                const { match, path } = result;
                const { productName, edition } = extractProductInfo(path);

                // Update solution logo and name
                const logoElement = document.getElementById("solution-logo");
                const solutionName = document.getElementById("solution-name");
                
                if (logoElement) {
                    logoElement.src = match.images.icon_white;
                    logoElement.alt = edition ? `${productName}: ${edition}` : productName;
                }
                
                if (solutionName) {
                    solutionName.textContent = edition ? `${productName}: ${edition}` : productName;
                    solutionName.style.whiteSpace = "nowrap";
                    solutionName.style.overflow = "hidden";
                    solutionName.style.textOverflow = "ellipsis";
                }

                // Create tab-switch elements
    if (match) {
        const switchTabs = document.querySelector(".switch-content");
        if (switchTabs) {
            Object.entries(match.url).forEach(([key, link]) => {
                if (typeof link === "string") {
                    const anchor = document.createElement("a");
                    anchor.href = link;
                    anchor.classList.add("content-switch-pill");
                    anchor.textContent = key.charAt(0).toUpperCase() + key.slice(1);
                    anchor.id = key;

                    // Determine if this pill should be active based on our new logic
                    const solutionId = getDashboardSolutionId();
                    const categoryId = getCommunityCategoryId();
                    const eventsSolutionId = getEventsSolutionId();
                    const zendeskSubdomain = getZendeskSubdomain();
                    const isSupport = isSupportSection();
                    
                    if (solutionId && key === "dashboard") {
                        // Active if we're on a dashboard page and this is the dashboard pill
                        anchor.classList.add("active");
                    } else if (categoryId && match.community_id && match.community_id.includes(categoryId) && key === "community") {
                        // Active if we're on a community page that matches this product's community_id
                        anchor.classList.add("active");
                    } else if (eventsSolutionId && key === "events") {
                        // Active if we're on an events page with matching solution parameter
                        anchor.classList.add("active");
                    } else if (zendeskSubdomain) {
                        // Handle Zendesk cases
                        if (key === "support" && isSupport) {
                            anchor.classList.add("active");
                        } else if (key === "help" && !isSupport) {
                            anchor.classList.add("active");
                        }
                    } else if (!solutionId && !categoryId && !eventsSolutionId && !zendeskSubdomain && currentUrl === link) {
                        // Fallback to URL matching if none of the special cases apply
                        anchor.classList.add("active");
                    }

                    switchTabs.appendChild(anchor);
                }
            });

            // Update sub-nav visibility with the loaded data
            updateSubNavVisibility(data);
            
            // Initialize mobile functionality
            setupMobileSwitchFunctionality();
            window.addEventListener('resize', handleResize);
        }
    }
            } else {
                console.log("No match found for current URL:", currentUrl);
                if (solutionMetadataDiv) solutionMetadataDiv.style.display = "none";
                
                // Still update sub-nav visibility in case we're on a community page
                updateSubNavVisibility(data);
            }
        })
        .catch(error => console.error("Error fetching JSON:", error));

    // Mobile switch functionality
    function setupMobileSwitchFunctionality() {
        const switchContent = document.querySelector(".switch-content");
        if (!switchContent) return;
    
        // Store original pills for restoration
        originalPills = Array.from(switchContent.querySelectorAll('.content-switch-pill'));
    
        // Create mobile menu container if it doesn't exist
        if (!mobileMenuContainer) {
            mobileMenuContainer = document.createElement('div');
            mobileMenuContainer.classList.add('mobile-pills-container');
            mobileMenuContainer.style.display = 'none';
            switchContent.appendChild(mobileMenuContainer);
            
            // Prevent clicks inside menu from closing it
            mobileMenuContainer.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    
        setupDocumentClickHandler(); // Add this line
        handleResize(); // Initialize based on current screen size
    }

    function handleResize() {
        const switchContent = document.querySelector(".switch-content");
        if (!switchContent) return;
    
        if (window.innerWidth <= 1140) {
            // Mobile view
            if (!mobileMenuCreated) {
                const activePill = switchContent.querySelector('.content-switch-pill.active');
                const otherPills = Array.from(switchContent.querySelectorAll('.content-switch-pill:not(.active)'));
    
                // Move non-active pills to mobile menu
                otherPills.forEach(pill => {
                    mobileMenuContainer.appendChild(pill);
                });
    
                // Add click handler to active pill
                if (activePill) {
                    activePill.addEventListener('click', toggleMobileMenu);
                }
    
                mobileMenuCreated = true;
            }
        } else {
            // Desktop view - restore original state
            if (mobileMenuCreated) {
                // Remove click handler and 'open' class from active pill
                const activePill = switchContent.querySelector('.content-switch-pill.active');
                if (activePill) {
                    activePill.removeEventListener('click', toggleMobileMenu);
                    activePill.classList.remove('open');
                }
    
                // Move all pills back to switchContent
                while (mobileMenuContainer.firstChild) {
                    switchContent.appendChild(mobileMenuContainer.firstChild);
                }
    
                // Restore original order (if needed)
                if (originalPills.length > 0) {
                    originalPills.forEach(pill => {
                        if (pill.parentNode !== switchContent) {
                            switchContent.appendChild(pill);
                        }
                    });
                }
    
                mobileMenuContainer.style.display = 'none';
                mobileMenuCreated = false;
            }
        }
    }

    function toggleMobileMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const activePill = document.querySelector('.switch-content .content-switch-pill.active');
        if (!activePill) return;
        
        if (mobileMenuContainer) {
            const isVisible = mobileMenuContainer.style.display === 'block';
            mobileMenuContainer.style.display = isVisible ? 'none' : 'block';
            
            // Toggle 'open' class on active pill
            if (isVisible) {
                activePill.classList.remove('open');
            } else {
                activePill.classList.add('open');
            }
        }
    }

    function setupDocumentClickHandler() {
        document.addEventListener('click', function(e) {
            const switchContent = document.querySelector(".switch-content");
            if (!switchContent || !mobileMenuCreated) return;
            
            // Check if click is outside both the active pill and the mobile menu
            const activePill = switchContent.querySelector('.content-switch-pill.active');
            const clickedOutside = !activePill.contains(e.target) && 
                                  !mobileMenuContainer.contains(e.target);
            
            if (clickedOutside && mobileMenuContainer.style.display === 'block') {
                mobileMenuContainer.style.display = 'none';
                if (activePill) {
                    activePill.classList.remove('open');
                }
            }
        });
    }

    // Helper Functions

    function extractProductInfo(path) {
        let productName, edition;

        if (path.length === 2) {
            productName = path[1];
            edition = null;
        } else if (path.length === 3) {
            productName = path[1];
            edition = path[2];
        } else {
            productName = path[path.length - 1];
            edition = null;
        }

        return { productName, edition };
    }

    function populateProductDirectory(data, container, currentMatch) {
        if (!container) return;
        
        container.innerHTML = '';
        let products = findAllProducts(data);
        
        // Sort products alphabetically by display name
        products = products.sort((a, b) => {
            const aInfo = extractProductInfo(a.path);
            const bInfo = extractProductInfo(b.path);
            const aName = aInfo.edition ? `${aInfo.productName}: ${aInfo.edition}` : aInfo.productName;
            const bName = bInfo.edition ? `${bInfo.productName}: ${bInfo.edition}` : bInfo.productName;
            return aName.localeCompare(bName);
        });
        
        products.forEach(product => {
            if (currentMatch && product.match === currentMatch) {
                return;
            }
            
            const { productName, edition } = extractProductInfo(product.path);
            const displayName = edition ? `${productName}: ${edition}` : productName;
    
            const anchor = document.createElement("a");
            anchor.href = getFirstUrl(product.match.url);
            anchor.classList.add("product-directory-item");
            
            const img = document.createElement("img");
            img.classList.add("solution-logo");
            img.src = product.match.images?.icon_white || '';
            img.alt = displayName;
            
            const span = document.createElement("span");
            span.classList.add("solution-name");
            span.textContent = displayName;
            span.style.whiteSpace = "nowrap";
            span.style.overflow = "hidden";
            span.style.textOverflow = "ellipsis";
            
            anchor.appendChild(img);
            anchor.appendChild(span);
            container.appendChild(anchor);
        });
    }
    
    function findAllProducts(obj, path = [], products = []) {
        for (const key in obj) {
            if (typeof obj[key] === "object" && obj[key] !== null) {
                if (obj[key].url && obj[key].images) {
                    products.push({
                        match: obj[key],
                        path: path.concat(key)
                    });
                }
                
                findAllProducts(obj[key], path.concat(key), products);
            }
        }
        return products;
    }
    
    function getFirstUrl(urlObj) {
        if (!urlObj) return '#';
        for (const key in urlObj) {
            if (typeof urlObj[key] === 'string') {
                return urlObj[key];
            }
        }
        return '#';
    }

    // Handle URL changes
    window.addEventListener('popstate', function() {
        fetch("https://patheticaesthetic94.github.io/customer-portal/product-directory.json")
            .then(response => response.json())
            .then(data => updateSubNavVisibility(data))
            .catch(error => console.error("Error fetching JSON:", error));
    });

    // Monkey-patch history API
    const originalPushState = history.pushState;
    history.pushState = function() {
        originalPushState.apply(this, arguments);
        fetch("https://patheticaesthetic94.github.io/customer-portal/product-directory.json")
            .then(response => response.json())
            .then(data => updateSubNavVisibility(data))
            .catch(error => console.error("Error fetching JSON:", error));
    };

    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        originalReplaceState.apply(this, arguments);
        fetch("https://patheticaesthetic94.github.io/customer-portal/product-directory.json")
            .then(response => response.json())
            .then(data => updateSubNavVisibility(data))
            .catch(error => console.error("Error fetching JSON:", error));
    };
});
