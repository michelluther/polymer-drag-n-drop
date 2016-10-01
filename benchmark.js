var DragDropFunctions =
{
    dragoverqueue : [],
    GetMouseBearingsPercentage : function($element,elementRect,mousePos)
    {
        if(!elementRect)
            elementRect = $element.get(0).getBoundingClientRect();
        var mousePosPercent_X = ((mousePos.x-elementRect.left)/(elementRect.right-elementRect.left))*100;
        var mousePosPercent_Y = ((mousePos.y-elementRect.top) /(elementRect.bottom-elementRect.top))*100;

        return {x:mousePosPercent_X,y:mousePosPercent_Y};
    },
    OrchestrateDragDrop : function($element, elementRect, mousePos)
    {
        //If no element is hovered or element hovered is the placeholder -> not valid -> return false;
        if(!$element || $element.length == 0 || !elementRect || !mousePos)
            return false;

        if($element.is('html'))
            $element = $element.find('body');
        //Top and Bottom Area Percentage to trigger different case. [5% of top and bottom area gets reserved for this]
        var breakPointNumber = {x:5,y:5};

        var mousePercents = this.GetMouseBearingsPercentage($element,elementRect,mousePos);
        if((mousePercents.x > breakPointNumber.x && mousePercents.x < 100-breakPointNumber.x) && (mousePercents.y > breakPointNumber.y && mousePercents.y < 100-breakPointNumber.y))
        {
            //Case 1 -
            $tempelement = $element.clone();
            $tempelement.find(".drop-marker").remove();
            if($tempelement.html() == "" && !this.checkVoidElement($tempelement))
            {
                if(mousePercents.y < 90)
                    return this.PlaceInside($element);
            }
            else if($tempelement.children().length == 0)
            {
                //text element detected
                //console.log("Text Element");
                this.DecideBeforeAfter($element,mousePercents);
            }
            else if($tempelement.children().length == 1)
            {
                //only 1 child element detected
                //console.log("1 Child Element");
                this.DecideBeforeAfter($element.children(":not(.drop-marker,[data-dragcontext-marker])").first(),mousePercents);
            }
            else
            {
                var positionAndElement = this.findNearestElement($element,mousePos.x,mousePos.y);
                this.DecideBeforeAfter(positionAndElement.el,mousePercents,mousePos);
                //more than 1 child element present
                //console.log("More than 1 child detected");
            }
        }
        else if((mousePercents.x <= breakPointNumber.x) || (mousePercents.y <= breakPointNumber.y))
        {
            var validElement = null
            if(mousePercents.y <= mousePercents.x)
                validElement = this.FindValidParent($element,'top');
            else
                validElement = this.FindValidParent($element,'left');

            if(validElement.is("body,html"))
                validElement = $("#clientframe").contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").first();
            this.DecideBeforeAfter(validElement,mousePercents,mousePos);
        }
        else if((mousePercents.x >= 100-breakPointNumber.x) || (mousePercents.y >= 100-breakPointNumber.y))
        {
            var validElement = null
            if(mousePercents.y >= mousePercents.x)
                validElement = this.FindValidParent($element,'bottom');
            else
                validElement = this.FindValidParent($element,'right');

            if(validElement.is("body,html"))
                validElement = $("#clientframe").contents().find("body").children(":not(.drop-marker,[data-dragcontext-marker])").last();
            this.DecideBeforeAfter(validElement,mousePercents,mousePos);
        }
    },
    DecideBeforeAfter : function($targetElement,mousePercents,mousePos)
    {
        if(mousePos)
        {
            mousePercents = this.GetMouseBearingsPercentage($targetElement,null,mousePos);
        }

        /*if(!mousePercents)
         {
         mousePercents = this.GetMouseBearingsPercentage($targetElement, $targetElement.get(0).getBoundingClientRect(), mousePos);
         } */

        $orientation = ($targetElement.css('display') == "inline" || $targetElement.css('display') == "inline-block");
        if($targetElement.is("br"))
            $orientation = false;

        if($orientation)
        {
            if(mousePercents.x < 50)
            {
                return this.PlaceBefore($targetElement);
            }
            else
            {
                return this.PlaceAfter($targetElement);
            }
        }
        else
        {
            if(mousePercents.y < 50)
            {
                return this.PlaceBefore($targetElement);
            }
            else
            {
                return this.PlaceAfter($targetElement);
            }
        }
    },
    checkVoidElement : function($element)
    {
        var voidelements = ['i','area','base','br','col','command','embed','hr','img','input','keygen','link','meta','param','video','iframe','source','track','wbr'];
        var selector = voidelements.join(",")
        if($element.is(selector))
            return true;
        else
            return false;
    },
    calculateDistance : function(elementData, mouseX, mouseY)
    {
        return Math.sqrt(Math.pow(elementData.x - mouseX, 2) + Math.pow(elementData.y - mouseY, 2));
    },
    FindValidParent : function($element,direction)
    {
        switch(direction)
        {
            case "left":
                while(true)
                {
                    var elementRect = $element.get(0).getBoundingClientRect();
                    var $tempElement = $element.parent();
                    var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                    if($element.is("body"))
                        return $element;
                    if(Math.abs(tempelementRect.left - elementRect.left) == 0)
                        $element = $element.parent();
                    else
                        return $element;
                }
                break;
            case "right":
                while(true)
                {
                    var elementRect = $element.get(0).getBoundingClientRect();
                    var $tempElement = $element.parent();
                    var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                    if($element.is("body"))
                        return $element;
                    if(Math.abs(tempelementRect.right - elementRect.right) == 0)
                        $element = $element.parent();
                    else
                        return $element;
                }
                break;
            case "top":
                while(true)
                {
                    var elementRect = $element.get(0).getBoundingClientRect();
                    var $tempElement = $element.parent();
                    var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                    if($element.is("body"))
                        return $element;
                    if(Math.abs(tempelementRect.top - elementRect.top) == 0)
                        $element = $element.parent();
                    else
                        return $element;
                }
                break;
            case "bottom":
                while(true)
                {
                    var elementRect = $element.get(0).getBoundingClientRect();
                    var $tempElement = $element.parent();
                    var tempelementRect = $tempElement.get(0).getBoundingClientRect();
                    if($element.is("body"))
                        return $element;
                    if(Math.abs(tempelementRect.bottom - elementRect.bottom) == 0)
                        $element = $element.parent();
                    else
                        return $element;
                }
                break;
        }
    },
    addPlaceHolder : function($element,position,placeholder)
    {
        if(!placeholder)
            placeholder = this.getPlaceHolder();
        this.removePlaceholder();
        switch(position)
        {
            case "before":
                placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                $element.before(placeholder);
                console.log($element);
                console.log("BEFORE");
                this.AddContainerContext($element,'sibling');
                break;
            case "after":
                placeholder.find(".message").html($element.parent().data('sh-dnd-error'));
                $element.after(placeholder);
                console.log($element);
                console.log("AFTER");
                this.AddContainerContext($element,'sibling');
                break
            case "inside-prepend":
                placeholder.find(".message").html($element.data('sh-dnd-error'));
                $element.prepend(placeholder);
                this.AddContainerContext($element,'inside');
                console.log($element);
                console.log("PREPEND");
                break;
            case "inside-append":
                placeholder.find(".message").html($element.data('sh-dnd-error'));
                $element.append(placeholder);
                this.AddContainerContext($element,'inside');
                console.log($element);
                console.log("APPEND");
                break;
        }
    },
    removePlaceholder : function()
    {
        $("#clientframe").contents().find(".drop-marker").remove();
    },
    getPlaceHolder : function()
    {
        return $("<li class='drop-marker'></li>");
    },
    PlaceInside : function($element)
    {
        var placeholder = this.getPlaceHolder();
        placeholder.addClass('horizontal').css('width',$element.width()+"px");
        this.addPlaceHolder($element,"inside-append",placeholder);
    },
    PlaceBefore : function($element)
    {
        var placeholder = this.getPlaceHolder();
        var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block");
        if($element.is("br"))
        {
            inlinePlaceholder = false;
        }
        else if($element.is("td,th"))
        {
            placeholder.addClass('horizontal').css('width',$element.width()+"px");
            return this.addPlaceHolder($element,"inside-prepend",placeholder);
        }
        if(inlinePlaceholder)
            placeholder.addClass("vertical").css('height',$element.innerHeight()+"px");
        else
            placeholder.addClass("horizontal").css('width',$element.parent().width()+"px");
        this.addPlaceHolder($element,"before",placeholder);
    },

    PlaceAfter : function($element)
    {
        var placeholder = this.getPlaceHolder();
        var inlinePlaceholder = ($element.css('display') == "inline" || $element.css('display') == "inline-block");
        if($element.is("br"))
        {
            inlinePlaceholder = false;
        }
        else if($element.is("td,th"))
        {
            placeholder.addClass('horizontal').css('width',$element.width()+"px");
            return this.addPlaceHolder($element,"inside-append",placeholder);
        }
        if(inlinePlaceholder)
            placeholder.addClass("vertical").css('height',$element.innerHeight()+"px");
        else
            placeholder.addClass("horizontal").css('width',$element.parent().width()+"px");
        this.addPlaceHolder($element,"after",placeholder);
    },
    findNearestElement : function($container,clientX,clientY)
    {
        var _this = this;
        var previousElData = null;
        var childElement = $container.children(":not(.drop-marker,[data-dragcontext-marker])");
        if(childElement.length > 0)
        {
            childElement.each(function()
            {
                if($(this).is(".drop-marker"))
                    return;

                var offset = $(this).get(0).getBoundingClientRect();
                var distance = 0;
                var distance1,distance2 = null;
                var position = '';
                var xPosition1 = offset.left;
                var xPosition2 = offset.right;
                var yPosition1 = offset.top;
                var yPosition2 = offset.bottom;
                var corner1 = null;
                var corner2 = null;

                //Parellel to Yaxis and intersecting with x axis
                if(clientY > yPosition1 && clientY <  yPosition2 )
                {
                    if(clientX < xPosition1 && clientY < xPosition2)
                    {
                        corner1 = {x:xPosition1, y:clientY,'position':'before'};
                    }
                    else
                    {
                        corner1 = {x:xPosition2, y:clientY,'position':'after'};
                    }

                }
                //Parellel to xAxis and intersecting with Y axis
                else if(clientX > xPosition1 && clientX < xPosition2)
                {
                    if(clientY < yPosition1 && clientY < yPosition2)
                    {
                        corner1 = {x:clientX, y:yPosition1,'position':'before'};
                    }
                    else
                    {
                        corner1 = {x:clientX, y:yPosition2,'position':'after'};
                    }

                }
                else
                {
                    //runs if no element found!
                    if(clientX < xPosition1 && clientX < xPosition2)
                    {
                        corner1 = {x:xPosition1, y:yPosition1,'position':'before'};          //left top
                        corner2 = {x:xPosition1, y :yPosition2,'position':'after'};       //left bottom
                    }
                    else if(clientX > xPosition1 && clientX > xPosition2)
                    {
                        //console.log('I m on the right of the element');
                        corner1 = {x:xPosition2, y:yPosition1,'position':'before'};   //Right top
                        corner2 = {x:xPosition2, y :yPosition2,'position':'after'}; //Right Bottom
                    }
                    else if(clientY < yPosition1 && clientY < yPosition2)
                    {
                        // console.log('I m on the top of the element');
                        corner1 = {x :xPosition1, y:yPosition1,'position':'before'}; //Top Left
                        corner2 = {x :xPosition2, y:yPosition1,'position':'after'}; //Top Right
                    }
                    else if(clientY > yPosition1 && clientY > yPosition2)
                    {
                        // console.log('I m on the bottom of the element');
                        corner1 = {x :xPosition1, y:yPosition2,'position':'before'}; //Left bottom
                        corner2 = {x :xPosition2, y:yPosition2,'position':'after'} //Right Bottom
                    }
                }

                distance1 = _this.calculateDistance(corner1, clientX, clientY);

                if(corner2 !== null)
                    distance2 = _this.calculateDistance(corner2, clientX, clientY);

                if(distance1 < distance2 || distance2 === null)
                {
                    distance = distance1;
                    position = corner1.position;
                }
                else
                {
                    distance = distance2;
                    position = corner2.position;
                }

                if(previousElData !== null)
                {
                    if(previousElData.distance < distance)
                    {
                        return true; //continue statement
                    }
                }
                previousElData =    {'el':this,'distance':distance,'xPosition1':xPosition1,'xPosition2':xPosition2,'yPosition1':yPosition1,'yPosition2':yPosition2, 'position':position}
            });
            if(previousElData !== null)
            {
                var position = previousElData.position;
                return {'el':$(previousElData.el),'position':position};
            }
            else
            {
                return false;
            }
        }
    },
    AddEntryToDragOverQueue : function($element,elementRect,mousePos)
    {
        var newEvent = [$element,elementRect,mousePos];
        this.dragoverqueue.push(newEvent);
    },
    ProcessDragOverQueue : function($element,elementRect,mousePos)
    {
        var processing = this.dragoverqueue.pop();
        this.dragoverqueue = [];
        if(processing && processing.length == 3)
        {
            var $el = processing[0];
            var $elRect = processing[1];
            var mousePos = processing[2];
            this.OrchestrateDragDrop($el, $elRect, mousePos);
        }

    }
}