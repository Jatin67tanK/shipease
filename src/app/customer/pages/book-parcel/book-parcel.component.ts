import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/core/services/parcel.service';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-book-parcel',
  templateUrl: './book-parcel.component.html'
})
export class BookParcelComponent implements OnInit {

  isLoading = false;
  imageError = '';

  booking = {
    sender_name: '',
    sender_phone: '',
    sender_state: '',
    sender_city: '',
    receiver_name: '',
    receiver_phone: '',
    receiver_state: '',
    receiver_city: '',
    pickup_address: '',
    drop_address: '',
    distance_category: '',
    parcel_type: '',
    parcel_weight: '',
    delivery_type: 'Normal Delivery'
  };

  // Image handling
  selectedImages: { file: File; preview: string }[] = [];

  // State → City map (India)
  stateCityMap: Record<string, string[]> = {
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar'],
    'Karnataka': ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belagavi'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli'],
    'Delhi': ['New Delhi', 'Dwarka', 'Rohini', 'Janakpuri', 'Saket'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer'],
    'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Noida'],
    'West Bengal': ['Kolkata', 'Howrah', 'Asansol', 'Siliguri', 'Durgapur'],
    'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
    'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam'],
    'Punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala'],
    'Haryana': ['Gurugram', 'Faridabad', 'Hisar', 'Panipat', 'Ambala'],
    'Madhya Pradesh': ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
    'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur'],
  };

  stateList: string[] = Object.keys(this.stateCityMap);
  senderCities: string[] = [];
  receiverCities: string[] = [];

  constructor(
    private parcelService: ParcelService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.refreshProfile();
  }

  refreshProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res: any) => {
        if (res?.data) {
          localStorage.setItem('profile', JSON.stringify(res.data));
        }
      }
    });
  }

  // ✅ State → City dropdowns
  onSenderStateChange(state: string): void {
    this.booking.sender_city = '';
    this.senderCities = this.stateCityMap[state] || [];
  }

  onReceiverStateChange(state: string): void {
    this.booking.receiver_city = '';
    this.receiverCities = this.stateCityMap[state] || [];
  }

  // ✅ Image selection — max 3, min 1
  onImageSelect(event: Event): void {
    this.imageError = '';
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const newFiles = Array.from(input.files);
    const remaining = 3 - this.selectedImages.length;

    if (remaining <= 0) {
      this.imageError = 'Maximum 3 images allowed.';
      return;
    }

    const toAdd = newFiles.slice(0, remaining);

    toAdd.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = `"${file.name}" exceeds 5MB limit.`;
        return;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImages.push({ file, preview: e.target.result });
      };
      reader.readAsDataURL(file);
    });

    // Reset input so same file can be re-selected if removed
    input.value = '';
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
    this.imageError = '';
  }

  private isUserVerified(): boolean {
    const profile = localStorage.getItem('profile');
    if (!profile) return false;
    try {
      return JSON.parse(profile)?.isNumVerified === true;
    } catch {
      return false;
    }
  }

  proceedToCheckout(): void {
    if (this.isLoading) return;

    if (!this.isUserVerified()) {
      alert('Verify your mobile number first 📲');
      return;
    }

    // Validate required fields
    if (!this.booking.sender_name || !this.booking.sender_phone ||
        !this.booking.receiver_name || !this.booking.receiver_phone ||
        !this.booking.pickup_address || !this.booking.drop_address ||
        !this.booking.sender_state || !this.booking.sender_city ||
        !this.booking.receiver_state || !this.booking.receiver_city ||
        !this.booking.distance_category || !this.booking.parcel_type ||
        !this.booking.parcel_weight) {
      alert('Fill all fields 😑');
      return;
    }

    // Validate images
    if (this.selectedImages.length === 0) {
      this.imageError = 'Please upload at least 1 parcel image.';
      return;
    }

    this.isLoading = true;

    // Build FormData to send files + fields
    const formData = new FormData();

    Object.entries(this.booking).forEach(([key, value]) => {
      formData.append(key, key === 'parcel_weight' ? String(Number(value)) : value);
    });

    this.selectedImages.forEach(img => {
      formData.append('parcel_images', img.file);
    });

    this.parcelService.bookParcel(formData).subscribe({
      next: (res: any) => {
        localStorage.setItem('booking', JSON.stringify(res.data));
        this.isLoading = false;
        this.router.navigate(['/customer/book/checkout']);
      },
      error: (err) => {
        console.error('Booking Error:', err);
        alert(err?.error?.message || 'Booking failed 💀');
        this.isLoading = false;
      }
    });
  }
}