
import {Injectable} from '@angular/core';
import Swal, { SweetAlertResult } from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AlertService
{


    waring(text : string = "Esta acción no podra ser revertida",title : string = "¿Estás seguro?") : Promise<SweetAlertResult<any>>
    {
        return Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, confirmar',
            cancelButtonText: 'No, cancelar'
        });
    }

    /**
     * Muestra un modal personalizado con múltiples opciones.
     * @param title Título del modal.
     * @param text Texto descriptivo.
     * @param options Arreglo de opciones con propiedades 'text' (texto del botón) y 'value' (valor asociado).
     * @returns Una promesa que se resuelve con un objeto { value: string } indicando la opción seleccionada.
     */
    customConfirmation(title: string, text: string, options: { text: string, value: string }[]): Promise<{ value: string }> {
        return new Promise<{ value: string }>((resolve) => {
            Swal.fire({
                title: title,
                html: `<p>${text}</p><div id="custom-buttons"></div>`,
                showConfirmButton: false,
                allowOutsideClick: false,
                didOpen: () => {
                    const container = Swal.getHtmlContainer()!.querySelector('#custom-buttons') as HTMLElement;
                    options.forEach(option => {
                        const button = document.createElement('button');
                        button.textContent = option.text;
                        button.classList.add('swal2-confirm', 'swal2-styled');
                        button.style.margin = '5px';
                        button.onclick = () => {
                            resolve({ value: option.value });
                            Swal.close();
                        };
                        container.appendChild(button);
                    });
                }
            });
        });
    }

}