<?php

?>
<article class='app' id="mini_calc">
  <header>
    <h3>Mini calculatrice</h3>
  </header>
  <section class='block_form0'>
    <p class="info">Opérateurs : ( R1 <strong>+</strong> R2 )
    &rarr; composants en série; ( R1 <strong>//</strong> R2 )
    &rarr; composants en parallèle.</p>
    <p class="info">Grandeurs : <strong>p</strong>ico(10^-12);
    <strong>n</strong>ano(10^-9); <strong>u</strong>:micro(10^-6);
    <strong>m</strong>illi(10^-3); <strong>k</strong>ilo(10^3);
    <strong>M</strong>ega(10^-6)</p>
    <div>
      Résistance &mdash;[/\/\/]- <span><input type="text" value=""
      name="calc_in_resistance" id="calc_in_resistance" size="20"
      onchange="mini_calc_resistance()" placeholder=
      "r // ( ((a+b)*(a-b)) / c )"></span>=<span id=
      "calc_out_resistance"></span> Ohm
    </div>
    <div>
      Capacitance &mdash;| |&mdash; <span><input type="text" value=
      "" name="calc_in_capacitance" id="calc_in_capacitance" size=
      "20" onchange="mini_calc_capacitance()" placeholder=
      "r // ( ((a+b)*(a-b)) / c )"></span>=<span id=
      "calc_out_capacitance"></span> Farad
    </div>
  </section>
</article>