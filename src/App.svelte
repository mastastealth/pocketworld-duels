<script>

</script>

<main>
	<div class="game">
		<section class="you player"></section>
		<aside class="war-bar"></aside>
		<main class="table"></main>
		<section class="me player"></section>
	</div>
</main>

<style>
.game {
	display: grid;
	grid-template-areas:
		"p2 p2 p2 p2"
		"ws tb tb tb"
		"p1 p1 p1 p1";
	grid-template-columns: 200px 1fr;
	grid-template-rows: 150px 1fr 150px;
	height: 100vh;
}

.you {
	grid-area: p2;
}

.war-bar { 
	background: red;
	height: 100%;
	grid-area: ws;
}

.table {
	background: #FAFAFA;
	height: 100%;
	grid-area: tb;
}

.me {
	grid-area: p1;
}

.player {
	background: tan;
	height: 100%;
	width: 100%;
}
</style>