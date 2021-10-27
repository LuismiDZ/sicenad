import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { HeaderComponent } from '../core/shell/header/header.component';
import {Location} from '@angular/common';

@Injectable()
export class CanActivateViaLoggingNormal implements CanActivateChild {

    idCenad: string ='';

    constructor(private router: Router,
                private location: Location) { }

    canActivateChild() {
        // si el usuario no está loggeado como normal le dará un alert y le llevará a la pag principal del cenad donde estaba
        if (!HeaderComponent.isNormal) {
            let url = location.toString();
            this.idCenad = this.getId(url);
            this.router.navigate([`/principalCenad/${this.idCenad}`]);             
            alert('Debes identificarte como unidad para continuar');
            return false;
        }

        return true;
    }

    //metodo para extraer el id de la url
    getId(url: string): string {
        return url.slice(url.lastIndexOf('/') + 1, url.length);
    }
}