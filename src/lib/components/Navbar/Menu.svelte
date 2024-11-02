<script>
    let menuItems = [
      { label: 'Home', link: '/' },
    ];

    function closeNav() {
      document.getElementById("mySidebar").style.cssText = "width: 0; border-right: 0.5px";
    }
  </script>

  <div id="mySidebar" class="sidebar">
    <p href="javascript:void(0)" class="closebtn" on:click={closeNav}>x</p>
    {#each menuItems as item }
    <a href={item.link}>{item.label}</a>
    {/each}
  </div>