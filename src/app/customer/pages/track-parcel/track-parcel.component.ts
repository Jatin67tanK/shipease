import { Component, OnInit } from '@angular/core';
import { HttpClient }        from '@angular/common/http';
import { ActivatedRoute }    from '@angular/router';
import { ParcelService }     from 'src/app/core/services/parcel.service';
import { environment }       from 'src/environments/environment';

@Component({
  selector: 'app-track-parcel',
  templateUrl: './track-parcel.component.html'
})
export class TrackParcelComponent implements OnInit {

  trackingId    = '';
  parcel: any   = null;
  isLoading     = false;
  errorMessage  = '';

  API = environment.apiUrl;  // public — used in template for image src

  constructor(
    private parcelService: ParcelService,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.trackingId = params['id'];
        this.trackParcel();
      }
    });
  }

  trackParcel(): void {
    if (!this.trackingId.trim()) {
      this.errorMessage = 'Please enter a Tracking ID';
      return;
    }
    this.isLoading   = true;
    this.errorMessage = '';
    this.parcel       = null;

    // Route: GET /api/parcels/:tracking_id
    this.parcelService.trackParcel(this.trackingId.trim()).subscribe({
      next: (res: any) => {
        const d = res.data;

        this.parcel = {
          id:               d.tracking_id,
          status:           d.current_status,
          cycle_status:     d.cycle_status,
          sender:           d.sender_name,
          senderPhone:      d.sender_phone,
          senderCity:       d.sender_city   || '',
          senderState:      d.sender_state  || '',
          receiver:         d.receiver_name,
          receiverPhone:    d.receiver_phone,
          receiverCity:     d.receiver_city || '',
          receiverState:    d.receiver_state || '',
          pickup:           d.pickup_address,
          drop:             d.drop_address,
          type:             d.parcel_type,
          weight:           d.parcel_weight,
          distance:         d.distance_category,
          delivery:         d.delivery_type,
          cost:             d.total_cost,
          payment:          d.payment_status,
          bookedAt:         d.createdAt,
          deliveredAt:      d.deliveredAt   || null,
          // images come from parcel doc directly
          images:           d.parcel_images || [],
          assignedEmployee: d.assigned_employee?.name || null,
          specialNote:      d.specialNote   || null,
        };

        this.isLoading = false;

        // Route: GET /api/parcels/:tracking_id/images
        // Only call if parcel has no images in main response
        if (this.parcel.images.length === 0) {
          this.http.get<any>(`${this.API}/api/parcels/${this.trackingId.trim()}/images`).subscribe({
            next: (r) => { this.parcel.images = r.data?.images || []; },
            error: ()  => { /* silently ignore — images optional */ }
          });
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Parcel not found';
        this.isLoading    = false;
      }
    });
  }

  statusColor(s: string): string {
    const map: Record<string, string> = {
      'Booked':      'bg-blue-100 text-blue-700',
      'Picked Up':   'bg-indigo-100 text-indigo-700',
      'In Transit':  'bg-yellow-100 text-yellow-700',
      'Delivered':   'bg-green-100 text-green-700',
      'Refunded':    'bg-red-100 text-red-600',
      'ASSIGNED':    'bg-blue-100 text-blue-700',
      'IN_TRANSIT':  'bg-yellow-100 text-yellow-700',
      'DELIVERED':   'bg-green-100 text-green-700',
      'FAILED':      'bg-red-100 text-red-600',
    };
    return map[s] || 'bg-gray-100 text-gray-600';
  }

  paymentColor(p: string): string {
    return p === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700';
  }

  get progressStep(): number {
    const steps: Record<string, number> = {
      'Booked': 1, 'PENDING': 1,
      'Picked Up': 2, 'ASSIGNED': 2,
      'In Transit': 3, 'IN_TRANSIT': 3,
      'Delivered': 4, 'DELIVERED': 4,
    };
    return steps[this.parcel?.status] || steps[this.parcel?.cycle_status] || 1;
  }
}