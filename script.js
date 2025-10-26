$(document).ready(function() {
  let isPaused = false;
  let cycleDisplay = parseInt(localStorage.getItem('cycleDisplay')) || 1;
  let dayDisplay = parseFloat(localStorage.getItem('dayDisplay')) || 1.0;
  let cycleInterval, dayInterval;

  // Navigation toggle logic removed - direct navigation now

  // Handle navigation links with page transition - only for actual navigation links
  $(document).on('click', 'a[href]', function(e) {
    const href = $(this).attr('href');
    
    // Skip if it's a main navigation toggle link (no href or href="#")
    if (!href || href === '#') {
      return;
    }
    
    // Skip if it's a "Make food" link (no actual destination)
    if ($(this).text().includes('Make food')) {
      return;
    }
    
    // Only handle links that actually navigate somewhere
    if (href.includes('/') || href === '../' || href === '../index.html' || href === 'index.html') {
      e.preventDefault();
      
      // Check if we're going from about to home (don't restart timers)
      const isAboutToHome = window.location.pathname.includes('about') && (href === '../' || href === '../index.html' || href === 'index.html');
      
      // Determine if it's a festival page for theme
      const festivalName = href.replace(/^.*\//, '').replace('/', '').replace('index.html', '');
      const isFestivalPage = ['chunjie', 'yuanxiaojie', 'duanwujie', 'qixi', 'zhongqiujie', 'chongyangjie'].includes(festivalName);
      
      // Add transition class based on festival (if it's a festival page)
      if (isFestivalPage) {
        $('body').removeClass().addClass(festivalName + '-theme');
      } else {
        // Reset to default theme for non-festival pages
        $('body').removeClass();
      }
      
      // Capture current page content as the top layer
      const $currentPageClone = $('body').clone();
      $currentPageClone.find('script').remove(); // Remove scripts from clone
      
    // Create page transition with Photoshop-like layers
    const $transition = $(`
      <div class="page-transition">
        <iframe src="${href}" style="width: 100%; height: 100%; border: none;"></iframe>
        <div class="current-page-content">
          ${$currentPageClone.html()}
        </div>
      </div>
    `);
      $('body').append($transition);
      
      // Start wipe effect - mask wipes away current page content to reveal new page underneath
      setTimeout(() => {
        $transition.addClass('slide-in');
      }, 50);
      
    // Navigate ONLY after transition completes - URL changes after wipe effect
    setTimeout(() => {
      if (isAboutToHome) {
        // For about to home, just navigate without restarting timers
        window.location.href = href;
      } else {
        // For other navigation, restart timers
        window.location.href = href;
      }
    }, 1200);
    }
  });

  // Pause
  function pauseAnimation() {
    clearInterval(cycleInterval);
    clearInterval(dayInterval);
    isPaused = true;
    $('.moon, .disc').css('animation-play-state', 'paused');
  }
  
  // Play
  function playAnimation() {
    if (isPaused) {
      isPaused = false;
      $('.moon, .disc').css('animation-play-state', 'running');
      startCycle();
    }
  }
  
  // Restart
  function restartAnimation() {
    clearInterval(cycleInterval);
    clearInterval(dayInterval);
    cycleDisplay = 1;
    dayDisplay = 1.0;
    $('#cycleDisplay').text(cycleDisplay);
    $('#dayDisplay').text(Math.floor(dayDisplay));
    
    // Reset link colors
    $('.link a').css('color', '');
    changeLinkColor();
  
    // Restart moon animation
    $('.moon, .disc').css({
      'animation': 'none'
    });

    setTimeout(() => {
      $('.moon, .disc').css('animation', 'rotate 15s linear infinite, flip 15s steps(2) infinite');
    }, 10);
  
    isPaused = false;
    startCycle();
  }

  $('#pause').click(function() {
    console.log('Pause clicked');
    pauseAnimation();
    $(this).css('fill', 'var(--yellow)');
    $('#play').css('fill', '');
    $('#restart').css('fill', '');
  });

  $('#play').click(function() {
    console.log('Play clicked');
    playAnimation();
    $(this).css('fill', 'var(--yellow)');
    $('#pause').css('fill', '');
    $('#restart').css('fill', '');
  });

  $('#restart').click(function() {
    console.log('Restart clicked');
    restartAnimation();
    $(this).css('fill', 'var(--yellow)');
    $('#pause').css('fill', '');
    $('#play').css('fill', '');
  });

  function updateCycle() {
    cycleDisplay = (cycleDisplay % 12) + 1;
    localStorage.setItem('cycleDisplay', cycleDisplay);
    $('#cycleDisplay').text(cycleDisplay);
    changeLinkColor();
  }

  function updateDay() {
    dayDisplay = (dayDisplay >= 29.5) ? 1.0 : parseFloat((dayDisplay + 0.1).toFixed(1));
    localStorage.setItem('dayDisplay', dayDisplay);
    $('#dayDisplay').text(Math.floor(dayDisplay));
    changeLinkColor();
  }

  function startCycle() {
    cycleInterval = setInterval(updateCycle, 15000);
    dayInterval = setInterval(updateDay, 52.63157894736842);
  }

  // Update display with saved values
  $('#cycleDisplay').text(cycleDisplay);
  $('#dayDisplay').text(Math.floor(dayDisplay));
  
  startCycle();

  function changeLinkColor() {
    // Don't change link colors on project pages
    if (window.location.pathname.includes('chunjie') || 
        window.location.pathname.includes('yuanxiaojie') || 
        window.location.pathname.includes('duanwujie') || 
        window.location.pathname.includes('qixi') || 
        window.location.pathname.includes('zhongqiujie') || 
        window.location.pathname.includes('chongyangjie')) {
      return;
    }
    
    $('.link a').css('color', '');
    if (cycleDisplay === 1 && dayDisplay >= 1.0 && dayDisplay < 4.0) {
      $('.link:has(a:contains("春节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 1 && dayDisplay >= 15.0 && dayDisplay < 18.0) {
      $('.link:has(a:contains("元宵节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 5 && dayDisplay >= 15.0 && dayDisplay < 18.0) {
      $('.link:has(a:contains("端午节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 7 && dayDisplay >= 15.0 && dayDisplay < 18.0) {
      $('.link:has(a:contains("七夕")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 8 && dayDisplay >= 15.0 && dayDisplay < 18.0) {
      $('.link:has(a:contains("中秋节")) a').css('color', 'var(--yellow)');
    }
    if (cycleDisplay === 9 && dayDisplay >= 9.0 && dayDisplay < 12.0) {
      $('.link:has(a:contains("重阳节")) a').css('color', 'var(--yellow)');
    }
  }

  // Safari-compatible scroll-based background transition
  function handleScrollTransition() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const documentHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    const scrollPercent = scrollTop / (documentHeight - windowHeight);
    
    // 春节 (Spring Festival) - Red to Pink
    const chunjieElement = document.getElementById('chunjie');
    if (chunjieElement) {
      if (scrollPercent > 0.5) {
        chunjieElement.style.background = '#FF5597';
      } else {
        chunjieElement.style.background = '#F1001E';
      }
    }
    
    // 中秋节 (Mid-Autumn Festival) - Blue to Purple
    const zhongqiujieElement = document.getElementById('zhongqiujie');
    if (zhongqiujieElement) {
      if (scrollPercent > 0.5) {
        zhongqiujieElement.style.background = '#67287F';
      } else {
        zhongqiujieElement.style.background = '#0076D0';
      }
    }
  }

  // Use both jQuery and vanilla JS for maximum compatibility
  $(window).on('scroll', handleScrollTransition);
  window.addEventListener('scroll', handleScrollTransition, { passive: true });
});