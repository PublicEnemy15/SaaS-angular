import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './comment-thread-component.html',
  styleUrls: ['./comment-thread-component.scss'],
})
export class CommentThreadComponent implements OnInit {
  comment = signal<any>(null);
  replies = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  private idWeb = '';
  private idComment = '';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.idWeb = params['idWeb'];
      this.idComment = params['commentId'];

      if (this.idWeb && this.idComment) {
        this.loadThread();
      } else {
        this.error.set('Faltan parámetros en la URL');
      }
    });
  }

  loadThread(): void {
    this.loading.set(true);
    this.api.getInboxComment(this.idWeb, this.idComment).subscribe({
      next: (res) => {
        console.log('Respuesta del backend:', res);
        if (Array.isArray(res) && res.length > 0) {
          const mainComment = res[0];
          this.comment.set(mainComment);
          this.replies.set(mainComment.comments || []);
        } else {
          this.error.set('Comentario no encontrado');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error cargando hilo', err);
        this.error.set('Error cargando respuestas');
        this.loading.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/comments'], { queryParams: { idWeb: this.idWeb } });
  }
}
