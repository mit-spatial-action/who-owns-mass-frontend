<script lang="ts">

    import { errorState } from "$lib/stores";

 </script>
 
<div class="card">
    <div class="card-content message is-warning">
        <div >{$errorState}</div>
    </div>
</div>