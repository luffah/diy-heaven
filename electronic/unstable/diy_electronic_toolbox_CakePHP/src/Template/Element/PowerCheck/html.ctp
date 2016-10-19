<?php

?>
<article class='app' id="calcul_puissance">
  <header>
    <h3>Vérification de puissance</h3>
  </header>
  <section class='block_form0 cadre'>
    <form>
      <label for="resistance_link">Résistance</label><input size=
      "8" name="resistance" id="resistance_link"> <label for=
      "tension">Tension aux bornes<small>(en Volt)</small></label>
      <input size="6" value="9" name="tension" id="tension">
      <label for="puissance">Puissance à dissiper<small>(en
      Watt)</small></label> <input size="6" value="" name=
      "puissance" id="puissance" disabled> <button onclick=
      "calcul_puissance();return false;" title=
      "Vérifier la puissance">Calculer !</button>
    </form><span><small id="indication_puissance"></small></span>
  </section>
</article>
