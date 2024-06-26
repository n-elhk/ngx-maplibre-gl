import { Directive, afterNextRender, inject, input } from '@angular/core';
import { NavigationControl, type NavigationControlOptions } from 'maplibre-gl';
import { MapService } from '../map/map.service';
import { ControlComponent } from './control.component';
import { keepAvailableObjectValues } from '../shared';

/**
 * `mglNavigation` - a navigation control directive
 *
 * @category Directives
 *
 * @see [Navigation](https://maplibre.org/ngx-maplibre-gl/demo/navigation)
 * @see [NavigationControl](https://maplibre.org/maplibre-gl-js/docs/API/classes/NavigationControl)
 */
@Directive({
  selector: '[mglNavigation]',
  standalone: true,
})
export class NavigationControlDirective {
  /* Init injection */
  private readonly mapService = inject(MapService);
  private readonly controlComponent = inject<
    ControlComponent<NavigationControl>
  >(ControlComponent, { host: true });

  /* Init inputs */
  readonly showCompass = input<boolean>();
  readonly showZoom = input<boolean>();
  readonly visualizePitch = input<boolean>();

  constructor() {
    afterNextRender(() => {
      this.mapService.mapCreated$.subscribe(() => {
        if (this.controlComponent.control) {
          throw new Error('Another control is already set for this control');
        }
        const options = keepAvailableObjectValues<NavigationControlOptions>({
          showCompass: this.showCompass(),
          showZoom: this.showZoom(),
          visualizePitch: this.visualizePitch(),
        });
        this.controlComponent.control = new NavigationControl(options);
        this.mapService.addControl(
          this.controlComponent.control,
          this.controlComponent.position()
        );
      });
    });
  }
}
