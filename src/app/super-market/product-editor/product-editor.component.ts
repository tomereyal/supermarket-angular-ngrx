import { Observable } from 'rxjs';
import IProduct from '@app/interfaces/product.interface';
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ICategory from '@app/interfaces/category.interface';
import { ProductService } from '../state&service/product.service';
import { Store } from '@ngrx/store';
import { StateWithSm } from '../state&service/sm.reducer';
import { defaultProductImage } from '../../../assets/images';
import { ImageUploadService } from '@app/image-upload.service';
@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.css'],
})
export class ProductEditorComponent implements OnInit {
  @Input() product: IProduct | void | null;
  $currentProduct: Observable<IProduct>;
  form: FormGroup;
  $categories: Observable<ICategory[]>;
  isEditingForm: boolean;
  defaultProductImage = defaultProductImage;
  originalUrl: string | undefined;
  loading = false;
  productId: string | undefined;
  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private imageUploadService: ImageUploadService,
    private store: Store<StateWithSm>
  ) {}

  ngOnInit(): void {
    // this.isEditingForm = this.product?._id ? true : false;
    this.form = this.fb.group({
      name: ['', Validators.required],
      url: [defaultProductImage],
      categoryRef: ['', Validators.required],
      price: [0, Validators.required],
    });
    this.$categories = this.productService.getCategories();

    this.store
      .select((state) => state.sm.currentProduct)
      .subscribe((p) => {
        if (p) {
          this.isEditingForm = p._id ? true : false;
          this.originalUrl = p.url;
          this.productId = p._id;
          this.form.patchValue({
            name: p.name,
            url: p.url ? p.url : defaultProductImage,
            categoryRef: p.categoryRef,
            price: p.price,
          });
        }
      });
  }

  get fc() {
    return this.form.controls;
  }

  async onSubmit() {
    if (this.form.invalid) {
      console.log(`this.form.value`, this.form.value);
      return;
    }
    this.loading = true;

    const currentUrl = this.fc.url.value;
    const isDifferentUrl = this.originalUrl !== currentUrl;
    if (isDifferentUrl) {
      let url = await this.imageUploadService.uploadImage(this.fc.url.value);
      console.log(`url form value:`, url);
      this.form.patchValue({ url });
    }

    if (this.isEditingForm && this.productId) {
      const { name, price, url, categoryRef } = this.form.value;
      const update = isDifferentUrl
        ? this.form.value
        : { name, price, categoryRef };

      await this.productService.updateProduct(this.productId, {
        update: update,
      });
      this.productService.setCurrentProduct(this.form.value);
      this.loading = false;
    } else {
      await this.productService.createProduct(this.form.value);
      this.productService.setCurrentProduct(this.form.value);
      this.loading = false;
      this.form.reset();
    }
  }

  convertFileToBase64EncodedFile(e: any) {
    e.preventDefault();
    const file = e.target.files[0];
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        const fileUrl = reader.result as string;
        this.fc.url.setValue(fileUrl); //this url is a base64encoded file
      };
    } catch (error) {
      console.log(`error`, error);
    }
  }
  pasteClipboardText = (e: any) => {
    e.preventDefault();
    navigator.clipboard
      .readText()
      .then((text) => {
        console.log(`text`, text);
        this.fc.url.setValue(text);
      })
      .catch((err) => {
        // maybe user didn't grant access to read from clipboard
        console.log('Something went wrong', err);
      });
  };
  eraseCurrentUrl(e: any) {
    e.preventDefault();
    this.fc.url.setValue('');
  }
  handleUrlError(e: any) {
    console.log(`e`, e);
    this.fc.url.setValue('');
  }

  setEmptyProduct() {
    const newProduct = {
      _id: '',
      name: '',
      price: 0,
      categoryRef: '',
      url: '',
    };
    this.productService.setCurrentProduct(newProduct);
  }
}
