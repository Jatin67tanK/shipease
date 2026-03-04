import { Component, OnInit } from '@angular/core';
import { ParcelService } from 'src/app/core/services/parcel.service';

@Component({
  selector: 'app-pricing-management',
  templateUrl: './pricing-management.component.html',
})
export class PricingManagementComponent implements OnInit {

  /* ✅ UI FRIENDLY MODEL */
  pricing: any = {
    local: 0,
    intercity: 0,
    interstate: 0,
    international: 0,
    perKg: 0,
    express: 0
  };

  isLoading = true;

  constructor(private parcelService: ParcelService) {}

  ngOnInit(): void {
    this.loadPricing();
  }

  /* =====================================================
     ✅ LOAD FROM DB → MAP TO UI
  ===================================================== */
  loadPricing(): void {

    this.parcelService.getPricing().subscribe({

      next: (res: any) => {

        if (!res?.data) {
          alert("Invalid pricing response 💀");
          this.isLoading = false;
          return;
        }

        const data = res.data;

        /* ✅ DB → UI MAPPING 😈🔥 */
        this.pricing = {
          local: data.local_base_price,
          intercity: data.intercity_base_price,
          interstate: data.interstate_base_price,
          international: data.international_base_price,
          perKg: data.price_per_kg,
          express: data.express_delivery_extra_charge
        };

        this.isLoading = false;
      },

      error: (err) => {
        console.warn("Pricing Load Error:", err);
        alert("Failed to load pricing 💀");
        this.isLoading = false;
      }
    });
  }

  /* =====================================================
     ✅ RESET = RELOAD FROM DB
  ===================================================== */
  resetPricing(): void {
    this.loadPricing();
  }

  /* =====================================================
     ✅ SAVE → MAP UI TO DB
  ===================================================== */
  savePricing(): void {

    /* ✅ UI → DB PAYLOAD 😎🔥 */
    const payload = {
      local_base_price: this.pricing.local,
      intercity_base_price: this.pricing.intercity,
      interstate_base_price: this.pricing.interstate,
      international_base_price: this.pricing.international,
      price_per_kg: this.pricing.perKg,
      express_delivery_extra_charge: this.pricing.express
    };

    this.parcelService.updatePricing(payload).subscribe({

      next: () => {
        alert("Pricing updated successfully 😎🔥");
        this.loadPricing();   // 🔥 Sync UI with DB
      },

      error: (err) => {
        console.warn("Pricing Save Error:", err);
        alert("Pricing update failed 💀");
      }
    });
  }
}