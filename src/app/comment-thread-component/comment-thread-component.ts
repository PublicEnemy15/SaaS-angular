import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

interface CommentWithReplies {
  idComment: number;
  user: string;
  content: string;
  created: string | Date; // Puede venir como string o Date
  replies: number;
  comments?: any[];
  showReplyBox?: boolean;
  replyText?: string;
}

@Component({
  selector: 'app-comment-thread',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-thread-component.html',
  styleUrls: ['./comment-thread-component.scss'],
})
export class CommentThreadComponent implements OnInit {
  comment = signal<CommentWithReplies | null>(null);
  replies = signal<CommentWithReplies[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  submitting = signal<boolean>(false);
  mainReplyText = signal<string>('');
  showMainReplyBox = signal<boolean>(false);

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
        if (Array.isArray(res) && res.length > 0) {
          const mainComment = res[0];
          
          // Actualizar el contador de replies con el número real de comentarios
          const actualRepliesCount = (mainComment.comments || []).length;
          
          this.comment.set({
            ...mainComment,
            replies: actualRepliesCount, // Actualizar con el conteo real
            showReplyBox: false,
            replyText: ''
          });

          const repliesWithState = (mainComment.comments || []).map((reply: any) => ({
            ...reply,
            showReplyBox: false,
            replyText: ''
          }));
          this.replies.set(repliesWithState);
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

  toggleMainReply(): void {
    this.showMainReplyBox.set(!this.showMainReplyBox());
  }

  toggleReplyBox(reply: CommentWithReplies): void {
    reply.showReplyBox = !reply.showReplyBox;
    this.replies.set([...this.replies()]);
  }

  submitMainReply(): void {
    const content = this.mainReplyText().trim();
    if (!content) return;

    this.submitting.set(true);
    this.postReply(this.idComment, content, () => {
      this.mainReplyText.set('');
      this.showMainReplyBox.set(false);
      this.loadThread();
    });
  }

  submitNestedReply(reply: CommentWithReplies): void {
    const content = reply.replyText?.trim();
    if (!content) return;

    this.submitting.set(true);
    this.postReply(reply.idComment.toString(), content, () => {
      reply.replyText = '';
      reply.showReplyBox = false;
      this.loadThread();
    });
  }

  private postReply(targetCommentId: string, content: string, onSuccess: () => void): void {
    this.api.postInboxReply(this.idWeb, targetCommentId, content).subscribe({
      next: () => {
        this.submitting.set(false);
        onSuccess();
      },
      error: (err) => {
        console.error('Error enviando respuesta', err);
        this.error.set('Error al enviar la respuesta');
        this.submitting.set(false);
      }
    });
  }

  deleteReply(replyId: number): void {
    if (!confirm('¿Estás seguro de eliminar esta respuesta?')) return;

    this.api.deleteInboxComment(this.idWeb, replyId.toString()).subscribe({
      next: () => {
        this.loadThread(); 
      },
      error: (err) => {
        console.error('Error eliminando respuesta', err);
        this.error.set('Error al eliminar la respuesta');
      }
    });
  }

  formatDate(dateString: string | Date): string {
    if (!dateString) return '';
    

    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    
    if (isNaN(date.getTime())) {
      console.warn('Fecha inválida recibida:', dateString);
      return 'Fecha inválida';
    }
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/comments'], {
      queryParams: { idWeb: this.idWeb }
    });
  }
}