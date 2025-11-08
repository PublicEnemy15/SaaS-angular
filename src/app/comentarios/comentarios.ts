import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Comment {
  id: number;
  username: string;
  comment: string;
  date: Date;
  replies: number;
}

@Component({
  selector: 'app-comentarios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comentarios.html',
  styleUrls: ['./comentarios.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComentariosComponent {
  domainName = signal<string>('');
  
  comments = signal<Comment[]>([]);

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.domainName.set(params['domain'] || 'Dominio desconocido');
    });
  }

  goBack(): void {
    this.router.navigate(['/platform']);
  }

  deleteComment(commentId: number): void {
    this.comments.update(comments => 
      comments.filter(comment => comment.id !== commentId)
    );
  }

  toggleMenu(commentId: number): void {
    const menu = document.querySelector(`#menu-${commentId}`);
    if (menu) {
      menu.classList.toggle('active');
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}