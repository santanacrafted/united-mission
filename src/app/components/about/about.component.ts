import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonComponent } from '../../shared/components/button/button.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TranslateModule, ButtonComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  leaders = [
    {
      name: 'Pastor John Ramirez',
      role: 'Lead Pastor',
      photo:
        'https://media.istockphoto.com/id/2164799931/photo/businessman-portrait-with-arms-crossed.jpg?s=1024x1024&w=is&k=20&c=EDPIEVk6zEMPSi_24ldfL_gpH5q94CMqNx8gr0isi8k=',
    },
    {
      name: 'Maria Lopez',
      role: 'Worship Ministry Leader',
      photo:
        'https://media.istockphoto.com/id/2070897862/photo/cheerful-young-woman-smiling-positive-and-joyful-happy-curly-haired-student-laughing-looking.jpg?s=1024x1024&w=is&k=20&c=Id_vE9cF8YiHIKFH3JvUopESyZ23WtNORuaFOcicqVA=',
    },
    {
      name: 'Carlos Gomez',
      role: 'Youth Pastor',
      photo:
        'https://media.istockphoto.com/id/1949501832/photo/handsome-hispanic-senior-business-man-with-crossed-arms-smiling-at-camera-indian-or-latin.jpg?s=1024x1024&w=is&k=20&c=r7kQcwLCz2LvMZlHZlssIvHLhAgllsh-tRlw4tYdpjc=',
    },
    {
      name: 'Elena Rivera',
      role: 'Women’s Ministry Coordinator',
      photo:
        'https://media.istockphoto.com/id/2156062809/photo/headshot-closeup-portrait-middle-eastern-israel-businesswoman-business-lady-standing-isolated.jpg?s=1024x1024&w=is&k=20&c=FMZoDL-kjLTUfdDCCP21BaeUCft3MObtnLFfcAn268Y=',
    },
    {
      name: 'David Torres',
      role: 'Men’s Ministry Leader',
      photo:
        'https://media.istockphoto.com/id/2160439329/photo/happy-multiethnic-male-teacher-smiling-at-primary-school.jpg?s=1024x1024&w=is&k=20&c=U1g9UIavWXjdpteh1eAs_D_Mof_3JTHQK_n433IASuI=',
    },
    {
      name: 'Sarah Martinez',
      role: 'Children’s Ministry Director',
      photo:
        'https://media.istockphoto.com/id/1770305449/photo/serious-portrait-leader-and-mature-woman-in-office-with-confidence-pride-and-business.jpg?s=1024x1024&w=is&k=20&c=xiVLKwkGYjpEc4xPIlH9w2qs_XJfJJHiiKaaPProeO8=',
    },
  ];
}
