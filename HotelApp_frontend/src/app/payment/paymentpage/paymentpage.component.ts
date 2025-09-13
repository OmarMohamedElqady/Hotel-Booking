import { Component } from '@angular/core';
import {
  loadStripe,
  Stripe,
  StripeElement,
  StripeCardElement,
  StripeElements,
} from '@stripe/stripe-js';
import { ApiService } from '../../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-paymentpage',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './paymentpage.component.html',
  styleUrl: './paymentpage.component.css',
})
export class PaymentpageComponent {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: StripeCardElement | null = null;

  clientSecrete: any = null; //unique transaction id for every transaction
  error: any = null;
  processing: boolean = false;

  bookingReference: string | null = null;
  amount: number | null = null;

  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.bookingReference =
      this.route.snapshot.paramMap.get('bookingReference');
    this.amount = parseFloat(this.route.snapshot.paramMap.get('amount') || '0');

    // load andn initialize the stripe.js
    this.stripe = await loadStripe(
      'pk_test_51RpFHNRoxBgwbOiqa4wg9aEIuWiJoRb525BAgRGwB6sJ8r6cRQFBIGf0iPNTKemKsxH5fllN9yFipTtZ7aiuXW5L00f4GsqkQl'
    );
    if (this.stripe) {
      this.elements = this.stripe.elements();
      this.cardElement = this.elements.create('card');
      this.cardElement.mount('#card-element');
    }

    //fetch transaction unique id
    this.fetchClientSecrate();
  }

  fetchClientSecrate(): void {
    const paymentData = {
      bookingReference: this.bookingReference,
      amount: this.amount,
    };
    this.apiService.proceedForPayment(paymentData).subscribe({
      next: (res: any) => {
        this.clientSecrete = res.transactionId;
      },
      error: (err: any) => {
        this.showError(
          err?.error?.message || 'failed to fetch transaction unique secrate'
        );
      },
    });
  }

  showError(msg: any): void {
    this.error = msg;
    setTimeout(() => {
      this.error = '';
    }, 5000);
  }

  //This is the method to call when a user click on pay now after he has filled his card details
  async handleSubmit(event: Event) {
    event.preventDefault();
    console.log('PAY Button was clicked');

    if (
      !this.stripe ||
      !this.elements ||
      !this.clientSecrete ||
      !this.processing
    ) {
      this.showError('Please fill in your card details properly');
      return;
    }

    this.processing = true;

    const { error, paymentIntent } = await this.stripe.confirmCardPayment(
      this.clientSecrete,
      {
        payment_method: {
          card: this.cardElement!,
        },
      }
    );

    if (paymentIntent && paymentIntent.status === 'succeeded') {
      this.processing = false;
      console.log('Payment intent id is: ' + paymentIntent.id);
      this.handleUpdateBookingPayment('succeeded', paymentIntent.id);
      this.router.navigate([`/payment-success/${this.bookingReference}`]);
    } else if (error) {
      console.log('PAYMENT ERROR: ' + error);
      this.handleUpdateBookingPayment('failed', error.message);
      this.showError(error?.message || error || 'PAYMENT ERROR');
    } else {
      this.showError(
        'Unable to process transaction at the moment. Please Try Again!'
      );
    }
  }

  handleUpdateBookingPayment(
    paymentStatus: string,
    transactionId: string = '',
    failureReason: string = ''
  ) {
    console.log('INSIDE handlePaymentStatus()');
    if (!this.bookingReference || !this.amount) return;

    console.log('BOOKING REFERENCE: ' + this.bookingReference);
    console.log('BOOKING AMOUNT IS: ' + this.amount);

    console.log('Payment status is: ' + paymentStatus);
    console.log('transactionId IS: ' + transactionId);
    console.log('failurereason IS: ' + failureReason);

    const paymentData = {
      bookingReference: this.bookingReference,
      amount: this.amount,
      transactionId,
      success: paymentStatus === 'succeeded',
      failureReason,
    };

    this.apiService.updateBookingPayment(paymentData).subscribe({
      next: (res: any) => {
        console.log(res);
      },
      error: (err) => {
        this.showError(
          err?.error?.message || err?.message || 'Error updating payment status'
        );
        console.error(err);
      },
    });
  }
}
