# drag and drop Konzeptpapier

## Genereller Aufbau
- behavior für draggable
- behavior für droptarget

## Verhalten
- bei hochnehmen sagt man, wo man herkommt
- das bedeutet, dass man irgendwie wissen muss, wo man herkommt ... 
    - will man das alles im dom halten? oder
    - will man beim parent nachfragen können, wo man gerade war ... 
        - vielleicht macht man das dann über ein event?
            - dragStart --> raise event ... attachen eines eigenen datenobjekts, das wird dann beim parent behandelt
        - oder man lässt die kinder sich beim parent registrieren? Vielleicht legt man eher so was wie den drop-container im dom ab damit das draggable ding weiß, wo es sich registrieren soll?
        - Man könnte eine Behavior-Registrierungsinstanz pro dropcontainer haben ...
            - Bei welcher Instanz man sich registrieren muss, das kann man herausfinden, indem man die "drop-target-class" übergibt.
            - Über this.parentNode()? Oder über events.
            ´´´
            <drop-area data-drop-id="" data-drop-class="steps">
                <step id="" data-drop-target-class="steps" data-drop-class="contentItems">
                    <content-item data-drop-target-class="contentItems">
                        
                    </content-item>
                </step>
            </drop-area>
            ´´´